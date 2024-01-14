import admin from 'firebase-admin'
import { fireConfig } from './fireconfig'

try {
  admin.initializeApp({
    credential: admin.credential.cert(fireConfig),
    databaseURL: "https://mymedicosupdated-default-rtdb.asia-southeast1.firebasedatabase.app"
  })
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack)
  }
}

export default admin