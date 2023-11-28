export const getTypeName = <T>(instance: T): string => {
  // Check if the instance has a constructor
  if (instance && instance.constructor) {
    // Use the constructor's name property to get the type name
    return instance.constructor.name;
  } else {
    // Fallback: Use the typeof operator to get the type name
    return typeof instance;
  }
};

export const isEmptyObject = (obj: Record<string, any>): boolean => Object.keys(obj).length === 0;
