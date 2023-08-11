export const findById = (resources, id) => {
  if (!resources) return null;
  return resources.find((resource) => resource.id === id);
};

export const upsert = (resources, resource) => {
  const index = resources.findIndex((item) => item.id === resource.id);
  const isExisting = resource.id && index !== -1;
  if (isExisting) {
    resources[index] = resource;
    return;
  }
  resources.push(resource);
};

export const makeAppendChildToParent = ({ child, parent }) => {
  return (store, { childId, parentId }) => {
    const resource = findById(store[parent], parentId);
    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
};
