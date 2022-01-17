export interface Language {
    lang: string;
    name: string;
    version: string;
    index: string;
  }
  
  export type LanguageTable = Iterable<[string, Language[]]>;
  
  export type LanguageMap = Map<string, Language[]>;
  
  export const languagesTable: LanguageTable = [
    [
      'c', [
          { lang: 'c', name: 'C', version: 'GCC 5.3.0', index: '0' }
      ]
    ],
    [
      'cpp14', [
          { lang: 'cpp14', name: 'C++', version: 'GCC 5.3.0', index: '0' }
      ]
    ],
    [
        'java', [
            { lang: 'java', name: 'Java', version: 'JDK 9.0.1', index: '1' }
        ]
    ],
    [
        'python3', [
            { lang: 'python3', name: 'Python 3', version: '3.6.5', index: '2' }
        ]
    ]
  ];
  