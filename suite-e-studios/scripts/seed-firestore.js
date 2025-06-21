/** @format */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Path to your service account key file
const serviceAccount = require("../suite-e-studios-firebase-adminsdk.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Path to your global checklists JSON file
const dataPath = path.join(__dirname, "../global.checklists.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const collectionsToClear = ["tasks", "taskLists", "checklists", "users"];

async function clearCollections() {
  console.log("Clearing existing data...");
  for (const collectionName of collectionsToClear) {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log(`Collection '${collectionName}' is already empty.`);
      continue;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`- Collection '${collectionName}' has been cleared.`);
  }
  console.log("All specified collections have been cleared.");
}

async function uploadAuthUsers() {
  console.log("Starting Auth user upload...");
  const { users } = data;
  if (!users || users.length === 0) {
    console.log("- No users to upload.");
    return;
  }

  for (const user of users) {
    try {
      // Check if user exists
      const userRecord = await admin.auth().getUserByEmail(user.email);
      console.log(
        `- User ${user.email} already exists. UID: ${userRecord.uid}`
      );
      // Update Firestore user profile
      await db.collection("users").doc(userRecord.uid).set({
        email: user.email,
        roleId: user.roleId,
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create new user
        const newUserRecord = await admin.auth().createUser({
          email: user.email,
          password: user.password,
        });
        console.log(
          `- Created new user: ${user.email} (UID: ${newUserRecord.uid})`
        );
        // Create Firestore user profile
        await db.collection("users").doc(newUserRecord.uid).set({
          email: user.email,
          roleId: user.roleId,
        });
      } else {
        throw error; // Re-throw other errors
      }
    }
  }
  console.log("Auth user upload complete.");
}

async function uploadData() {
  console.log("Starting data upload...");
  const { tasks, taskLists, checklists, roles, categories } = data;

  // Upload tasks
  if (tasks && tasks.length > 0) {
    const batch = db.batch();
    tasks.forEach((task) => {
      const docRef = db.collection("tasks").doc(task.id);
      batch.set(docRef, task);
    });
    await batch.commit();
    console.log(`- Uploaded ${tasks.length} tasks.`);
  }

  // Upload task lists
  if (taskLists && taskLists.length > 0) {
    const batch = db.batch();
    taskLists.forEach((taskList) => {
      const docRef = db.collection("taskLists").doc(taskList.id);
      batch.set(docRef, taskList);
    });
    await batch.commit();
    console.log(`- Uploaded ${taskLists.length} task lists.`);
  }

  // Upload checklists
  if (checklists && checklists.length > 0) {
    const batch = db.batch();
    checklists.forEach((checklist) => {
      const docRef = db.collection("checklists").doc(checklist.id);
      batch.set(docRef, checklist);
    });
    await batch.commit();
    console.log(`- Uploaded ${checklists.length} checklists.`);
  }

  // Upload roles
  if (roles && roles.length > 0) {
    const batch = db.batch();
    roles.forEach((role) => {
      const docRef = db.collection("roles").doc(role.id);
      batch.set(docRef, role);
    });
    await batch.commit();
    console.log(`- Uploaded ${roles.length} roles.`);
  }

  // Upload categories
  if (categories && categories.length > 0) {
    const batch = db.batch();
    categories.forEach((category) => {
      const docRef = db.collection("categories").doc(category.id);
      batch.set(docRef, category);
    });
    await batch.commit();
    console.log(`- Uploaded ${categories.length} categories.`);
  }

  console.log("Data upload complete.");
}

async function seed() {
  try {
    await clearCollections();
    await uploadAuthUsers();
    await uploadData();
    console.log("\n✅ Firestore database has been successfully seeded!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
