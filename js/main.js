const fileInput = document.querySelector('.fileInput'),
      textInput = document.querySelector('.textInput'),
      ouputText = document.querySelector('.ouputText'),
      outputImg = document.querySelector('.outputImg')

// for converting images to base64
const fileReader = new FileReader()



const indexedDB = window.indexedDB
const request = indexedDB.open("testDB4", 2)

request.onerror = (err) => {
    console.error(err)
}

request.onupgradeneeded = () => {
    const db = request.result
    const store = db.createObjectStore('inputs', {keyPath: 'id'})
    // const inputIndex = db.createObjectStore('index', {keyPath: 'id'})
    
    // store.createIndex("img", ['type'], {unique: false})
    store.createIndex("type", ['type'], {unique: false})
    // store.createIndex('audio', ['type'], {unique: false})
}

let textInputI
request.onsuccess = () => {
    console.log('database successfully loaded')
    // database stuff for adjusting and reading from it
    const db = request.result
    const transaction = db.transaction('inputs', 'readwrite')
    const store = transaction.objectStore('inputs')

    // rips the amount of inputs that have been sent and sets textInputI to that value
    // textInputI is what defines the ID for the inputs so each one is different
    let inputIndexQuery = store.get('inputIndex')
    inputIndexQuery.onsuccess = () => {
        let tmp = inputIndexQuery.result.value
        if (tmp == undefined) tmp = 0
        textInputI = tmp
    }
}
 
textInput.addEventListener('change', e => {
    // increments textInputI
    textInputI ++
    
    // database stuff to read and write into it later
    const db = request.result
    const transaction = db.transaction('inputs', 'readwrite')
    const store = transaction.objectStore('inputs')

    // index variable to query values by type
    const typeIndex = store.index('type')

    // pushes the input text into the DB
    // this is mostly just to learn but in a real environment these values would be important and need to be saved between page loads
    store.put({id: textInputI, type: 'text', value: textInput.value })
    // pushes the textInputI value into the value in the database
    // this is so the code can pull from the DB on load to keep the value proper according to the amount of input items
    store.put({id: 'inputIndex', value: textInputI})
    
    // queries the DB for all the values of type text
    // in a more worked out environment the db would be storing multiple input values
    let textQuery = typeIndex.getAll(['text'])
    // when the query succeeds it logs the result
    // this is necessary because everything with indexedDB is asynchronous so the next line of code will run immediately after the first line even if the first line hasn't finished yet
    // this is because with an external database there would be latency between getting and setting database values
    textQuery.onsuccess = () => {
        console.log(textQuery.result)
    }
})


// whenever a file is put into the file input this handles the file accordingly to its type
fileInput.addEventListener('change', (e) => {
    // helps determine file type
    let file = e.target.files[0]
    let fileType = file.type.split('/')[0]
    
    if (fileType == 'image') {
        // converts to base64 as result
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            file = fileReader.result

            // sets the src of the image to the base64 image code
            // the image was already there but didn't render since there was no src
            outputImg.src = file
        }
        fileReader.onerror = (err) => {
            console.error(err)
        }
    } else if (fileType == 'audio') {
        // converts to base64 as result
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            file = fileReader.result

            // sets an audio variable with the base64 audio code data to be played instantly
            let audio = new Audio(file)
            audio.cloneNode(true).play()
        }
        fileReader.onerror = (err) => {
            console.error(err)
        }
    }
})











//-_-_-| starting code, probably good but I couldn't get it working |-_-_-\\
// // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
// var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// // Open (or create) the database
// var open = indexedDB.open("testDB2", 1);

// // Create the schema
// open.onupgradeneeded = function() {
//     var db = open.result;
//     var store = db.createObjectStore("textInputStore", {keyPath: "id"});
//     var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
// };

// open.onsuccess = function() {
//     // Start a new transaction
//     var db = open.result;
//     var tx = db.transaction("textInputStore", "readwrite");
//     var store = tx.objectStore("textInputStore");
//     var index = store.index("NameIndex");

//     // Add some data
//     store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
//     store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
    
//     textInput.addEventListener('change', e => {
//         // open.onsuccess = () => {
//         let tx = db.transaction('textInputStore', "readwrite")
//         let store2 = tx.objectStore('textInputStore') 
//         store2.put({id: textInput.value})
//         // }
//         console.log(store)
//     })
    
//     // Query the data
//     var getJohn = store.get(12345);
//     var getBob = index.get(["Smith", "Bob"]);

//     getJohn.onsuccess = function() {
//         console.log(getJohn.result.name.first);  // => "John"
//     };

//     getBob.onsuccess = function() {
//         console.log(getBob.result.name.first);   // => "Bob"
//     };

//     // Close the db when the transaction is done
//     tx.oncomplete = function() {
//         db.close();
//     };

//     let red = store.get(67890)
//     red.onsuccess = () => {
//         console.log(red.result)
//     }
// }




























// --__|| BAD Personal Attempt ||__-- \\
// let db
// let objectStore

// const DBOpenRequest = window.indexedDB.open('testDB', 4)
// DBOpenRequest.onsuccess = (e) => {
//     db = DBOpenRequest.result
//     console.log(db)
// }

// DBOpenRequest.onupgradeneeded = (e) => {
//     console.log('objectStore')
//     console.log(objectStore)
//     db = DBOpenRequest.result

//     objectStore = db.createObjectStore("textInputStore");
//     // console.log(objectStore.index("textInputStore"))
// }

// const textInputTransaction = db.transaction('textInputStore', 'readwrite')


