const dbName = 'TRIDB'
const storeName = 'scenes'
const keyPath = 'sceneUrl'
class DataBase {
  constructor() {
    this._idbFactory = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB
    this._db = null
    this._enableSceneOffline = false;
    this._enableTexturesOffline = false;
    this._manifestVersionFound = 0;
    this._mustUpdateRessources = false;
    this._hasReachedQuota = false;
    this._opened = false
    // Env.scene.dbPromise = new Promise(resolve => {
    //   this.open(resolve);
    // });
  }

  open () {
    if (!this._opened) {
      this._opened = true
      if (!this._db) {
        this.readyPromise = new Promise(resolve => {
          const openRequest = this._idbFactory.open(dbName, 1);
          console.log('创建')
          openRequest.onsuccess = () => {
            this._db = openRequest.result
            resolve()
            console.log('创建完成')
          }

          openRequest.onupgradeneeded = (event) => {
            this._db = event.target.result;
            if (!this._db.objectStoreNames.contains(storeName)) {
              const store = this._db.createObjectStore(storeName, { keyPath })
              store.createIndex('contentIndex', 'content', { unique: false });
            }
          }
        })
      }
    }
    console.log('open')
    return this.readyPromise
  }

  addData(key, data) {
    const transaction = this._db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    store.put({ [keyPath]: key, content: data });
  }

  getData (key) {
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      request.onsuccess = function() {
        if (request.result) {
          resolve(request.result.content)
        } else {
          resolve()
        }
      };

      request.onerror = function() {
        console.error('Error retrieving data from IndexedDB:', request.error);
        reject()
      };
    })

  }
}

export default DataBase;
