export const findById = (resources, id) =>
  resources.find((resource) => resource.id === id);

export const upsert = (resources, resource) => {
  const index = resources.findIndex((item) => item.id === resource.id);
  const isExisting = resource.id && index !== -1;
  if (isExisting) {
    resources[index] = resource;
    return;
  }
  resources.push(resource);
};
