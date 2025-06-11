# React Query Mock Data Generator

A powerful and flexible package for generating mock data in React applications using React Query. This package provides hooks that make it easy to generate realistic mock data for testing and development purposes.

## Installation

```bash
npm install react-query-mock-data
# or
yarn add react-query-mock-data
# or
pnpm add react-query-mock-data
```

## Features

- 🎯 Type-safe mock data generation
- 🔄 React Query integration with `useQuery` and `useMutation`
- ⚙️ Configurable data generation
- 🎨 Customizable primitive types and value generators
- 🌍 Multi-language support
- 📦 Zero dependencies (except React Query)
- 🔒 Type-safe custom primitive types

## Basic Usage

```typescript
import { useMockData, useMockMutation } from 'react-query-mock-data';

// Define your schema
const userSchema = {
  id: 'uuid',
  name: 'name',
  email: 'email',
  age: 'number',
  isActive: 'boolean',
  address: {
    street: 'address',
    city: 'string',
    country: 'string'
  }
};

// Use in your component
function UserList() {
  const { data: users } = useMockData(userSchema, {
    count: 10 // Generate 10 users
  });

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Available Primitive Types

By default, the following primitive types are available:

- `string`: Random words
- `number`: Random integer between 1 and 100
- `boolean`: Random boolean
- `date`: Recent date in ISO format
- `image`: Random image URL
- `price`: Random price between 5 and 500
- `uuid`: Random UUID
- `name`: Random full name
- `phone`: Random phone number
- `email`: Random email address
- `text`: Random text
- `address`: Random street address
- `url`: Random URL

## Custom Configuration with Type Safety

You can add custom primitive types with full type safety:

```typescript
import { en, type Faker as FakerType } from "@faker-js/faker";
import { useMockData, type PrimitiveType, type FakerConfig } from 'react-query-mock-data';

// Define your custom types
type CustomTypes = 'customType1' | 'customType2';

// Custom configuration with type safety
const customConfig: FakerConfig<CustomTypes> = {
  primitiveTypes: ['customType1', 'customType2'],
  locale: en, // Set language to English
  generateMockValue: (type: PrimitiveType<CustomTypes>, faker: FakerType) => {
    switch (type) {
      case 'customType1':
        return faker.lorem.words(2);
      case 'customType2':
        return faker.lorem.words(2);
      default:
        return null; // Fall back to default generator for other types
    }
  }
};

// Use in your component with type safety
function CustomDataComponent() {
  const schema = {
    id: 'uuid',
    name: 'name',
    customField1: 'customType1',
    customField2: 'customType2'
  } as const;

  const { data } = useMockData<typeof schema, CustomTypes>(schema, {
    fakerConfig: customConfig
  });
  
  return <div>{/* Your component */}</div>;
}
```

## Language Support

The package supports multiple languages through the `locale` configuration option. By default, it uses 'fa' (Farsi), but you can change it to any supported locale:

```typescript
import { fa, en } from "@faker-js/faker";

// Use English locale
const englishConfig = {
  locale: en
};

// Use Farsi locale (default)
const farsiConfig = {
  locale: fa
};

// Use in your component
function MultiLanguageComponent() {
  const { data: englishData } = useMockData(schema, {
    fakerConfig: englishConfig
  });

  const { data: farsiData } = useMockData(schema, {
    fakerConfig: farsiConfig
  });

  return (
    <div>
      <h2>English Data</h2>
      <pre>{JSON.stringify(englishData, null, 2)}</pre>
      
      <h2>Farsi Data</h2>
      <pre>{JSON.stringify(farsiData, null, 2)}</pre>
    </div>
  );
}
```

## Hooks

### useMockData

Generates mock data using React Query's `useQuery`.

```typescript
const { data, isLoading, error } = useMockData<
  typeof schema,
  CustomTypes // Optional: Your custom types
>(schema, {
  count?: number;        // Number of items to generate (default: 5)
  single?: boolean;      // Whether to return a single object (default: false)
  fakerConfig?: {        // Optional custom configuration
    primitiveTypes: PrimitiveType<CustomTypes>[];
    locale?: LocaleDefinition;     // Language locale (default: 'fa')
    generateMockValue: (type: PrimitiveType<CustomTypes>, faker: Faker) => any;
  }
});
```

### useMockMutation

Generates mock data using React Query's `useMutation`.

```typescript
const { mutate, isLoading, error } = useMockMutation<
  typeof schema,
  CustomTypes // Optional: Your custom types
>(schema, {
  delay?: number;        // Delay in milliseconds (default: 300)
  single?: boolean;      // Whether to return a single object (default: false)
  count?: number;        // Number of items to generate (default: 5)
  fakerConfig?: {        // Optional custom configuration
    primitiveTypes: PrimitiveType<CustomTypes>[];
    locale?: LocaleDefinition;     // Language locale (default: 'fa')
    generateMockValue: (type: PrimitiveType<CustomTypes>, faker: Faker) => any;
  }
});
```

## Type Safety

The package is fully type-safe. The generated data will match the types inferred from your schema:

```typescript
// Define custom types
type CustomTypes = 'customType1' | 'customType2';

// Define schema with custom types
const schema = {
  id: 'uuid',
  name: 'name',
  customField: 'customType1'
} as const;

// data will be typed as { id: string; name: string; customField: string }[]
const { data } = useMockData<typeof schema, CustomTypes>(schema);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
