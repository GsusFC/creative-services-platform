# Informe de optimización del TYPE_COMPATIBILITY_MAP

## Resumen
- Tipos de Notion encontrados: 73
- Tipos de Website encontrados: 73
- Entradas en el mapa original: 20
- Entradas en el mapa optimizado: 66

## Nuevas entradas añadidas
- string: [string]
- text: [string, text]
- html: [string, html]
- float: [string, float]
- integer: [string, integer]
- boolean: [string, boolean]
- datetime: [string, datetime]
- array: [string, array]
- tags: [string, tags]
- categories: [string, categories]
- image: [string, image]
- file: [string, file]
- gallery: [string, gallery]
- phone: [string, phone]
- enum: [string, enum]
- category: [string, category]
- reference: [string, reference]
- user: [string, user]
- slug: [string, slug]
- link: [string, link]
- website: [string, website]
- decreasing: [string, decreasing]
- stable: [string, stable]
- 24h: [string, 24h]
- 7d: [string, 7d]
- 30d: [string, 30d]
- all: [string, all]
- medium: [string, medium]
- high: [string, high]
- critical: [string, critical]
- validation: [string, validation]
- api: [string, api]
- cache: [string, cache]
- memory: [string, memory]
- convert: [string, convert]
- extract: [string, extract]
- combine: [string, combine]
- custom: [string, custom]
- lenient: [string, lenient]
- none: [string, none]
- direct: [string, direct]
- simple: [string, simple]
- complex: [string, complex]
- template: [string, template]
- custom: [string, custom]
- fallback: [string, fallback]
- website-to-notion: [string, website-to-notion]

## Entradas modificadas


## Nuevo TYPE_COMPATIBILITY_MAP
```typescript
export const TYPE_COMPATIBILITY_MAP: Record<NotionFieldType, WebsiteFieldType[]> = {
  'title': ['string', 'text', 'richText', 'slug'],
  'richText': ['string', 'text', 'richText', 'html'],
  'number': ['number', 'string', 'float', 'integer'],
  'select': ['string', 'enum', 'category'],
  'multi_select': ['array', 'tags', 'categories'],
  'date': ['date', 'datetime', 'string'],
  'people': ['array', 'string', 'user'],
  'files': ['array', 'image', 'file', 'gallery'],
  'checkbox': ['boolean', 'string', 'number'],
  'url': ['string', 'url', 'link'],
  'email': ['string', 'email'],
  'phone_number': ['string', 'phone'],
  'formula': ['string', 'number', 'boolean', 'date'],
  'relation': ['reference', 'array', 'string'],
  'rollup': ['array', 'string', 'number'],
  'created_time': ['date', 'datetime', 'string'],
  'created_by': ['user', 'string'],
  'last_edited_time': ['date', 'datetime', 'string'],
  'last_edited_by': ['user', 'string'],
  'status': ['string', 'enum', 'status'],
  'string': ['string'],
  'text': ['string', 'text'],
  'html': ['string', 'html'],
  'float': ['string', 'float'],
  'integer': ['string', 'integer'],
  'boolean': ['string', 'boolean'],
  'datetime': ['string', 'datetime'],
  'array': ['string', 'array'],
  'tags': ['string', 'tags'],
  'categories': ['string', 'categories'],
  'image': ['string', 'image'],
  'file': ['string', 'file'],
  'gallery': ['string', 'gallery'],
  'phone': ['string', 'phone'],
  'enum': ['string', 'enum'],
  'category': ['string', 'category'],
  'reference': ['string', 'reference'],
  'user': ['string', 'user'],
  'slug': ['string', 'slug'],
  'link': ['string', 'link'],
  'website': ['string', 'website'],
  'decreasing': ['string', 'decreasing'],
  'stable': ['string', 'stable'],
  '24h': ['string', '24h'],
  '7d': ['string', '7d'],
  '30d': ['string', '30d'],
  'all': ['string', 'all'],
  'medium': ['string', 'medium'],
  'high': ['string', 'high'],
  'critical': ['string', 'critical'],
  'validation': ['string', 'validation'],
  'api': ['string', 'api'],
  'cache': ['string', 'cache'],
  'memory': ['string', 'memory'],
  'convert': ['string', 'convert'],
  'extract': ['string', 'extract'],
  'combine': ['string', 'combine'],
  'custom': ['string', 'custom'],
  'lenient': ['string', 'lenient'],
  'none': ['string', 'none'],
  'direct': ['string', 'direct'],
  'simple': ['string', 'simple'],
  'complex': ['string', 'complex'],
  'template': ['string', 'template'],
  'fallback': ['string', 'fallback'],
  'website-to-notion': ['string', 'website-to-notion'],
};
```

## Nuevo INVERSE_TYPE_COMPATIBILITY_MAP
```typescript
export const INVERSE_TYPE_COMPATIBILITY_MAP: Record<WebsiteFieldType, NotionFieldType[]> = {
  'string': ['title', 'richText', 'number', 'select', 'date', 'people', 'checkbox', 'url', 'email', 'phone_number', 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by', 'status', 'string', 'text', 'html', 'float', 'integer', 'boolean', 'datetime', 'array', 'tags', 'categories', 'image', 'file', 'gallery', 'phone', 'enum', 'category', 'reference', 'user', 'slug', 'link', 'website', 'decreasing', 'stable', '24h', '7d', '30d', 'all', 'medium', 'high', 'critical', 'validation', 'api', 'cache', 'memory', 'convert', 'extract', 'combine', 'custom', 'lenient', 'none', 'direct', 'simple', 'complex', 'template', 'fallback', 'website-to-notion'],
  'text': ['title', 'richText', 'text'],
  'richText': ['title', 'richText'],
  'slug': ['title', 'slug'],
  'html': ['richText', 'html'],
  'number': ['number', 'checkbox', 'formula', 'rollup'],
  'float': ['number', 'float'],
  'integer': ['number', 'integer'],
  'enum': ['select', 'status', 'enum'],
  'category': ['select', 'category'],
  'array': ['multi_select', 'people', 'files', 'relation', 'rollup', 'array'],
  'tags': ['multi_select', 'tags'],
  'categories': ['multi_select', 'categories'],
  'date': ['date', 'formula', 'created_time', 'last_edited_time'],
  'datetime': ['date', 'created_time', 'last_edited_time', 'datetime'],
  'user': ['people', 'created_by', 'last_edited_by', 'user'],
  'image': ['files', 'image'],
  'file': ['files', 'file'],
  'gallery': ['files', 'gallery'],
  'boolean': ['checkbox', 'formula', 'boolean'],
  'url': ['url'],
  'link': ['url', 'link'],
  'email': ['email'],
  'phone': ['phone_number', 'phone'],
  'reference': ['relation', 'reference'],
  'status': ['status'],
  'website': ['website'],
  'decreasing': ['decreasing'],
  'stable': ['stable'],
  '24h': ['24h'],
  '7d': ['7d'],
  '30d': ['30d'],
  'all': ['all'],
  'medium': ['medium'],
  'high': ['high'],
  'critical': ['critical'],
  'validation': ['validation'],
  'api': ['api'],
  'cache': ['cache'],
  'memory': ['memory'],
  'convert': ['convert'],
  'extract': ['extract'],
  'combine': ['combine'],
  'custom': ['custom'],
  'lenient': ['lenient'],
  'none': ['none'],
  'direct': ['direct'],
  'simple': ['simple'],
  'complex': ['complex'],
  'template': ['template'],
  'fallback': ['fallback'],
  'website-to-notion': ['website-to-notion'],
};
```

## Fecha de ejecución
2025-02-26T20:18:42.792Z
