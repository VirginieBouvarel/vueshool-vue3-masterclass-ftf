import db from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const findById = (resources, id) => {
  if (!resources) return null;
  return resources.find((resource) => resource.id === id);
};

export const upsert = (resources, resource) => {
  const index = resources.findIndex((item) => item.id === resource.id);
  const isExisting = resource.id && index !== -1;
  isExisting ? (resources[index] = resource) : resources.push(resource);
};

export const docToResource = (doc) => {
  if (typeof doc?.data !== "function") return doc;
  return { ...doc.data(), id: doc.id };
};

export const fetchItem = async ({ resources, collection, emoji, id }) => {
  console.log("🔥", emoji, id);
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const item = { ...docSnap.data(), id: docRef.id };
    upsert(resources, item);
    return item;
  } else {
    console.log("No such document!");
    return null;
  }
};

export const fetchItems = ({ resources, collection, emoji, ids }) => {
  return Promise.all(
    ids.map((id) => fetchItem({ resources, collection, emoji, id }))
  );
};

export const makeAppendChildToParent = ({ child, parent }) => {
  return (store, { childId, parentId }) => {
    const resource = findById(store[parent], parentId);

    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`
      );
      return;
    }
    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
};
