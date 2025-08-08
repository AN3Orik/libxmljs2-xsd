#ifndef BUILDING_NODE_EXTENSION
  #define BUILDING_NODE_EXTENSION
#endif

#include <iostream>
#include <list>
#include <node.h>
#include <nan.h>

// includes from libxmljs
#include <xml_syntax_error.h>
#include <xml_document.h>

#include "./node_libxml_xsd.h"
#include "./schema.h"
#include "./xml_errors.h"

using namespace v8;

void none(void *ctx, const char *msg, ...) {
  // do nothing
  return;
}

// Used to store a list or validation errors
void errorFunc(void* errs, xmlError* error) {
  std::vector<xmlError>* errors = reinterpret_cast<std::vector<xmlError>*>(errs);
  errors->push_back(*error);
}

NAN_METHOD(SchemaSync) {
    v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
  	Nan::HandleScope scope;

    // Instead of unwrapping, get the XML string from the document
    v8::Local<v8::Object> docObj = info[0]->ToObject(context).ToLocalChecked();
    
    // Call toString() method on the document to get XML string
    v8::Local<v8::String> toStringKey = Nan::New("toString").ToLocalChecked();
    v8::Local<v8::Value> toStringValue = docObj->Get(context, toStringKey).ToLocalChecked();
    
    if (!toStringValue->IsFunction()) {
        return Nan::ThrowError("Document object does not have toString method");
    }
    
    v8::Local<v8::Function> toStringFunc = v8::Local<v8::Function>::Cast(toStringValue);
    v8::Local<v8::Value> xmlStringValue = toStringFunc->Call(context, docObj, 0, nullptr).ToLocalChecked();
    
    if (!xmlStringValue->IsString()) {
        return Nan::ThrowError("toString did not return a string");
    }
    
    // Convert to C string
    Nan::Utf8String xmlString(xmlStringValue);
    
    // Parse the XML string to create xmlDoc
    xmlDocPtr xmlDoc = xmlReadMemory(*xmlString, xmlString.length(), NULL, NULL, 0);
    if (xmlDoc == NULL) {
        return Nan::ThrowError("Failed to parse XML document");
    }

    xmlSchemaParserCtxtPtr parser_ctxt = xmlSchemaNewDocParserCtxt(xmlDoc);
    if (parser_ctxt == NULL) {
        xmlFreeDoc(xmlDoc);
        return Nan::ThrowError("Could not create context for schema parser");
    }
    xmlSchemaValidityErrorFunc err;
    xmlSchemaValidityWarningFunc warn;
    void* ctx;
    xmlSchemaGetParserErrors(parser_ctxt, &err, &warn, &ctx);
    xmlSchemaSetParserErrors(parser_ctxt, err, (xmlSchemaValidityWarningFunc) none, ctx);
    xmlSchemaPtr schema = xmlSchemaParse(parser_ctxt);
    xmlSchemaFreeParserCtxt(parser_ctxt);
    xmlFreeDoc(xmlDoc);
    
    if (schema == NULL) {
        return Nan::ThrowError("Invalid XSD schema");
    }

    Local<Object> schemaWrapper = Schema::New(context, schema);
  	info.GetReturnValue().Set(schemaWrapper);
}

NAN_METHOD(ValidateSync) {
    Nan::HandleScope scope;
    Local<Context> context = info.GetIsolate()->GetCurrentContext();
    auto isolate = info.GetIsolate();

    // Prepare the array of errors to be filled by validation
    // Local<Array> errors = Nan::New<Array>();
    std::vector<xmlError> errorsList;
    xmlResetLastError();
    xmlSetStructuredErrorFunc(reinterpret_cast<void *>(&errorsList), errorFunc);

    // Extract schema from wrapper
    Schema* schema = Nan::ObjectWrap::Unwrap<Schema>(info[0]->ToObject(context).ToLocalChecked());

    // Get XML string from document object
    v8::Local<v8::Object> docObj = info[1]->ToObject(context).ToLocalChecked();
    
    // Call toString() method on the document to get XML string
    v8::Local<v8::String> toStringKey = Nan::New("toString").ToLocalChecked();
    v8::Local<v8::Value> toStringValue = docObj->Get(context, toStringKey).ToLocalChecked();
    
    if (!toStringValue->IsFunction()) {
        return Nan::ThrowError("Document object does not have toString method");
    }
    
    v8::Local<v8::Function> toStringFunc = v8::Local<v8::Function>::Cast(toStringValue);
    v8::Local<v8::Value> xmlStringValue = toStringFunc->Call(context, docObj, 0, nullptr).ToLocalChecked();
    
    if (!xmlStringValue->IsString()) {
        return Nan::ThrowError("toString did not return a string");
    }
    
    // Convert to C string
    Nan::Utf8String xmlString(xmlStringValue);
    
    // Parse the XML string to create xmlDoc
    xmlDocPtr xmlDoc = xmlReadMemory(*xmlString, xmlString.length(), NULL, NULL, 0);
    if (xmlDoc == NULL) {
        return Nan::ThrowError("Failed to parse XML document");
    }

    // Actual validation
    xmlSchemaValidCtxtPtr valid_ctxt = xmlSchemaNewValidCtxt(schema->schema_obj);
    if (valid_ctxt == NULL) {
        xmlFreeDoc(xmlDoc);
        return Nan::ThrowError("Unable to create a validation context for the schema");
    }
    xmlSchemaValidateDoc(valid_ctxt, xmlDoc);
    xmlFreeDoc(xmlDoc);

	xmlSetStructuredErrorFunc(NULL, NULL);

    // Don't return the boolean result, instead return array of validation errors
    // will be empty if validation is ok
    Local<Array> errors = Array::New(isolate);
    for (unsigned int i = 0; i < errorsList.size(); i++ ) {
      errors->Set(context, i, BuildSyntaxError(&errorsList.at(i)));
    }
    info.GetReturnValue().Set(errors);
    xmlSchemaFreeValidCtxt(valid_ctxt);
}

// Compose the module by assigning the methods previously prepared
void InitAll(Local<Object> exports, Local<Object> module, Local<Context> context) {
  	Schema::Init(exports, module, context);
  	exports->Set(context, Nan::New<String>("schemaSync").ToLocalChecked(), Nan::New<FunctionTemplate>(SchemaSync)->GetFunction(context).ToLocalChecked());
  	exports->Set(context, Nan::New<String>("validateSync").ToLocalChecked(), Nan::New<FunctionTemplate>(ValidateSync)->GetFunction(context).ToLocalChecked());
}

NODE_MODULE_CONTEXT_AWARE(node_libxml_xsd, InitAll);
