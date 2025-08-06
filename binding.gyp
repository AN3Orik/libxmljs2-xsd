{
  'includes': ['common.gypi'],
  "targets": [
    {
      "target_name": "node-libxml-xsd",
      "product_extension": "node",
      "sources": [ 
        "src/schema.cc", 
        "src/xml_errors.cc", 
        "src/node_libxml_xsd.cc"
      ],
      "include_dirs": [
      	"<!(node -e \"require('nan')\")",
      	'<@(xmljs_include_dirs)'
      ],
      'conditions': [
        ['OS=="win"', {
          # On Windows, we need to compile the required libxml2 source files
          'sources': [
            '<(node_xmljs)/vendor/libxml/xmlschemas.c',
            '<(node_xmljs)/vendor/libxml/xmlschemastypes.c',
            '<(node_xmljs)/vendor/libxml/error.c',
            '<(node_xmljs)/vendor/libxml/parser.c',
            '<(node_xmljs)/vendor/libxml/tree.c',
            '<(node_xmljs)/vendor/libxml/dict.c',
            '<(node_xmljs)/vendor/libxml/hash.c',
            '<(node_xmljs)/vendor/libxml/list.c',
            '<(node_xmljs)/vendor/libxml/xmlmemory.c',
            '<(node_xmljs)/vendor/libxml/xmlstring.c',
            '<(node_xmljs)/vendor/libxml/valid.c',
            '<(node_xmljs)/vendor/libxml/xpath.c',
            '<(node_xmljs)/vendor/libxml/xpointer.c',
            '<(node_xmljs)/vendor/libxml/xmlregexp.c',
            '<(node_xmljs)/vendor/libxml/xmlIO.c',
            '<(node_xmljs)/vendor/libxml/globals.c',
            '<(node_xmljs)/vendor/libxml/threads.c',
            '<(node_xmljs)/vendor/libxml/entities.c',
            '<(node_xmljs)/vendor/libxml/encoding.c',
            '<(node_xmljs)/vendor/libxml/SAX2.c',
            '<(node_xmljs)/vendor/libxml/SAX.c',
            '<(node_xmljs)/vendor/libxml/xmlreader.c',
            '<(node_xmljs)/vendor/libxml/relaxng.c',
            '<(node_xmljs)/vendor/libxml/uri.c',
            '<(node_xmljs)/vendor/libxml/buf.c',
            '<(node_xmljs)/vendor/libxml/pattern.c',
            '<(node_xmljs)/vendor/libxml/xmlunicode.c',
            '<(node_xmljs)/vendor/libxml/HTMLparser.c',
            '<(node_xmljs)/vendor/libxml/HTMLtree.c',
            '<(node_xmljs)/vendor/libxml/parserInternals.c',
            '<(node_xmljs)/vendor/libxml/chvalid.c',
            '<(node_xmljs)/vendor/libxml/catalog.c',
            '<(node_xmljs)/vendor/libxml/xmlsave.c',
            '<(node_xmljs)/vendor/libxml/legacy.c'
          ],
          'defines': [
            'LIBXML_STATIC',
            '_REENTRANT',
            'HAVE_WIN32_THREADS',
            'LIBXML_THREAD_ENABLED',
            '_CRT_SECURE_NO_WARNINGS',
            '_CRT_NONSTDC_NO_WARNINGS',
            'WITHOUT_ICONV',
            'LIBXML_STATIC_FOR_DLL'
          ],
          'msvs_settings': {
            'VCCLCompilerTool': {
              'AdditionalOptions': ['/wd4996', '/wd4267', '/wd4090', '/wd4018', '/wd4013', '/wd4047', '/wd4244']
            }
          }
        }, {
          'link_settings': {
            'libraries': [
              '<@(xmljs_libraries)'
            ]
          }
        }]
      ],
      'default_configuration': 'Release',
      'configurations': {
        'Debug': {
          'defines': [ 'DEBUG', '_DEBUG' ],
          'msvs_settings': {
            'VCCLCompilerTool': {
              'RuntimeLibrary': 1 # static debug
            }
          }
        },
        'Release': {
          'defines': [ 'NDEBUG' ],
          'msvs_settings': {
            'VCCLCompilerTool': {
              'RuntimeLibrary': 0 # static release
            }
          }
        }
      }
    }
  ]
}
