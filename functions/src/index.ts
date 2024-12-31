import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const db = admin.firestore();
  const batch = db.batch();

  // Delete user's projects
  const projectsSnapshot = await db
    .collection('projects')
    .where('userId', '==', user.uid)
    .get();

  projectsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete user's sources
  const sourcesSnapshot = await db
    .collection('sources')
    .where('userId', '==', user.uid)
    .get();

  sourcesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete user's settings
  const userDoc = db.collection('users').doc(user.uid);
  batch.delete(userDoc);

  // Commit all deletions
  await batch.commit();
}); 