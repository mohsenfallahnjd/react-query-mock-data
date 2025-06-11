import { fa, Faker } from "@faker-js/faker";
const defaultConfig = {
    primitiveTypes: [
        "string",
        "number",
        "boolean",
        "date",
        "image",
        "price",
        "uuid",
        "name",
        "phone",
        "email",
        "text",
        "address",
        "url",
    ],
    locale: fa,
    generateMockValue: (type, faker) => {
        switch (type) {
            case "string":
                return faker.lorem.words(2);
            case "number":
                return faker.number.int({ min: 1, max: 100 });
            case "boolean":
                return faker.datatype.boolean();
            case "date":
                return faker.date.recent().toISOString();
            case "image":
                return faker.image.urlPicsumPhotos();
            case "price":
                return faker.commerce.price({ min: 5, max: 500, dec: 2 });
            case "uuid":
                return faker.string.uuid();
            case "name":
                return faker.person.fullName();
            case "phone":
                return faker.phone.number();
            case "email":
                return faker.internet.email();
            case "text":
                return faker.lorem.text();
            case "address":
                return faker.location.streetAddress();
            case "url":
                return faker.internet.url();
            default:
                console.warn(`Unknown schema type: ${type}`);
                return null;
        }
    },
};
export function createFaker(config = {}) {
    const finalConfig = {
        ...defaultConfig,
        ...config,
        primitiveTypes: [
            ...new Set([...defaultConfig.primitiveTypes, ...(config.primitiveTypes || [])]),
        ],
        generateMockValue: (type, faker) => {
            // First try the custom generator if provided
            if (config.generateMockValue) {
                const customValue = config.generateMockValue(type, faker);
                if (customValue !== null) {
                    return customValue;
                }
            }
            // Fall back to default generator
            return defaultConfig.generateMockValue(type, faker);
        },
    };
    // Create a new faker instance with the specified locale
    const fakerInstance = new Faker({ locale: finalConfig.locale });
    function generateMockFromSchema(schema) {
        if (typeof schema === "string") {
            if (!finalConfig.primitiveTypes.includes(schema)) {
                console.warn(`Unknown schema type: ${schema}`);
                return null;
            }
            return finalConfig.generateMockValue(schema, fakerInstance);
        }
        if (Array.isArray(schema)) {
            const elementSchema = schema[0];
            const arrayLength = fakerInstance.number.int({ min: 2, max: 5 });
            return Array.from({ length: arrayLength }, () => generateMockFromSchema(elementSchema));
        }
        if (typeof schema === "object" && schema !== null) {
            const result = {};
            for (const key in schema) {
                result[key] = generateMockFromSchema(schema[key]);
            }
            return result;
        }
        return null;
    }
    return {
        generateMockFromSchema,
        config: finalConfig,
        faker: fakerInstance,
    };
}
// For backward compatibility
export const generateMockFromSchema = createFaker().generateMockFromSchema;
