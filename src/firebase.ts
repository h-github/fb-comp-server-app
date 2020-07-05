import Database from "nice-fb-api";
import { IDatabaseSetting } from "nice-fb-api/lib/types/databaseSetting";

export default () => {
  const dbSetting: IDatabaseSetting = {
    project_id: "testproject-835d8",
    api_key: "AIzaSyDbAQY8fU8WrzGhdXi1gPGR9jIwImXXASE",
    cache_max_age: 20000,
    cache_allocated_memory: 50,
  };

  const db = new Database(dbSetting);

  // The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
  // for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
  // to disable clean-up.
  db.firestore.settings({
    cacheSizeBytes: 80000000,
  });

  db.firestore.enablePersistence().catch(err => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.

      // tslint:disable-next-line: no-console
      console.error("failed-precondition", err);
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence

      // tslint:disable-next-line: no-console
      console.error("unimplemented", err);
    }
  });

  return db;
};
