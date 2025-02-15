// filesystemRouter.js
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';


const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Optional: enable CORS if needed for this router
router.use(cors());

// Parse JSON and URL-encoded bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Demo in-memory data store for files and folders
let demoFiles = [
  {
    id: '1',
    type: 'folder',
    mimeType: undefined,
    description: 'Root folder',
    name: 'root',
    path: '/',
    fileType: 'folder',
    tags: []
  },
  {
    id: '2',
    type: 'file',
    mimeType: 'text/plain',
    description: 'Demo text file',
    name: 'demo.txt',
    path: '/demo.txt',
    fileType: 'text',
    size: 1024,
    modified: new Date().toISOString(),
    tags: []
  }
];

// Utility: refresh demo data (for demo purposes this is a no-op)
function refresh() {
  // In a real system, you might re-read from disk or database.
  console.log('Refreshing file list...');
}

// --- API Endpoints ---

// GET /api/scandir?path=<path>
// Returns a list of FileEntry objects matching the requested path.
router.get('/scandir', (req, res) => {
  const { path = '/' } = req.query;
  // For demo, filter files that start with the provided path.
  const files = demoFiles.filter(file => file.path.startsWith(path));
  res.json(files);
});

// GET /api/listdir?path=<path>
// Returns a list of file/folder names in the requested directory.
router.get('/listdir', (req, res) => {
  const { path = '/' } = req.query;
  const names = demoFiles
    .filter(file => {
      // Check if the file is directly inside the given path
      if (path === '/') {
        // For root, we assume any file with a single-level path (e.g., /name)
        return file.path.split('/').filter(Boolean).length === 1;
      } else {
        return file.path.startsWith(path) &&
          file.path.replace(path, '').split('/').filter(Boolean).length === 1;
      }
    })
    .map(file => file.name);
  res.json(names);
});

// POST /api/chflags
router.post('/chflags', (req, res) => {
  const { path, flags } = req.body;
  console.log(`chflags on ${path} with flags:`, flags);
  refresh();
  res.json({ message: 'chflags success' });
});

// POST /api/fchdir
router.post('/fchdir', (req, res) => {
  const { fd } = req.body;
  console.log(`fchdir called with fd: ${fd}`);
  refresh();
  res.json({ message: 'fchdir success' });
});

// POST /api/lchflags
router.post('/lchflags', (req, res) => {
  const { path, flags } = req.body;
  console.log(`lchflags on ${path} with flags:`, flags);
  refresh();
  res.json({ message: 'lchflags success' });
});

// POST /api/mkdir
router.post('/mkdir', (req, res) => {
  const { path } = req.body;
  console.log(`mkdir called with path: ${path}`);
  // Add a new folder to demoFiles
  demoFiles.push({
    id: String(Date.now()),
    type: 'folder',
    mimeType: undefined,
    description: 'New folder',
    name: path.split('/').pop() || 'new_folder',
    path,
    fileType: 'folder',
    tags: []
  });
  refresh();
  res.json({ message: 'mkdir success' });
});

// POST /api/makedirs
router.post('/makedirs', (req, res) => {
  const { path } = req.body;
  console.log(`makedirs called with path: ${path}`);
  // For demo, treat it same as mkdir
  demoFiles.push({
    id: String(Date.now()),
    type: 'folder',
    mimeType: undefined,
    description: 'New directories',
    name: path.split('/').pop() || 'new_dirs',
    path,
    fileType: 'folder',
    tags: []
  });
  refresh();
  res.json({ message: 'makedirs success' });
});

// POST /api/link
router.post('/link', (req, res) => {
  const { src, dest } = req.body;
  console.log(`Linking from ${src} to ${dest}`);
  // For demo, just log and return success.
  refresh();
  res.json({ message: 'link success' });
});

// POST /api/remove
router.post('/remove', (req, res) => {
  const { path } = req.body;
  console.log(`Removing ${path}`);
  demoFiles = demoFiles.filter(file => file.path !== path);
  refresh();
  res.json({ message: 'remove success' });
});

// POST /api/removedirs
router.post('/removedirs', (req, res) => {
  const { path } = req.body;
  console.log(`Removing directories under ${path}`);
  // Remove all entries under the given path for demo purposes.
  demoFiles = demoFiles.filter(file => !file.path.startsWith(path));
  refresh();
  res.json({ message: 'removedirs success' });
});

// POST /api/rename
router.post('/rename', (req, res) => {
  const { oldPath, newPath } = req.body;
  console.log(`Renaming from ${oldPath} to ${newPath}`);
  demoFiles = demoFiles.map(file => {
    if (file.path === oldPath) {
      return { ...file, path: newPath, name: newPath.split('/').pop() };
    }
    return file;
  });
  refresh();
  res.json({ message: 'rename success' });
});

// POST /api/renames
router.post('/renames', (req, res) => {
  const { oldPath, newPath } = req.body;
  console.log(`Renaming (recursive) from ${oldPath} to ${newPath}`);
  demoFiles = demoFiles.map(file => {
    if (file.path.startsWith(oldPath)) {
      const relativePath = file.path.slice(oldPath.length);
      return { ...file, path: newPath + relativePath, name: (newPath + relativePath).split('/').pop() };
    }
    return file;
  });
  refresh();
  res.json({ message: 'renames success' });
});

// POST /api/replace
router.post('/replace', (req, res) => {
  const { src, dest } = req.body;
  console.log(`Replacing ${src} with ${dest}`);
  demoFiles = demoFiles.map(file => {
    if (file.path === src) {
      return { ...file, path: dest, name: dest.split('/').pop() };
    }
    return file;
  });
  refresh();
  res.json({ message: 'replace success' });
});

// POST /api/rmdir
router.post('/rmdir', (req, res) => {
  const { path } = req.body;
  console.log(`Removing directory ${path}`);
  demoFiles = demoFiles.filter(file => file.path !== path);
  refresh();
  res.json({ message: 'rmdir success' });
});

// POST /api/uploadFile
router.post('/uploadFile', upload.single('file'), (req, res) => {
  const { path } = req.body;
  console.log(`Uploading file to ${path}`, req.file);
  // For demo, we add a new file entry with dummy data.
  demoFiles.push({
    id: String(Date.now()),
    type: 'file',
    mimeType: req.file.mimetype,
    description: 'Uploaded file',
    name: req.file.originalname,
    path: path + '/' + req.file.originalname,
    fileType: 'file',
    size: req.file.size,
    modified: new Date().toISOString(),
    tags: []
  });
  refresh();
  res.json({ message: 'uploadFile success' });
});

// POST /api/uploadFiles
router.post('/uploadFiles', upload.array('files'), (req, res) => {
  const { path } = req.body;
  console.log(`Uploading multiple files to ${path}`, req.files);
  (req.files || []).forEach(file => {
    demoFiles.push({
      id: String(Date.now()),
      type: 'file',
      mimeType: file.mimetype,
      description: 'Uploaded file',
      name: file.originalname,
      path: path + '/' + file.originalname,
      fileType: 'file',
      size: file.size,
      modified: new Date().toISOString(),
      tags: []
    });
  });
  refresh();
  res.json({ message: 'uploadFiles success' });
});

// POST /api/uploadFolder
router.post('/uploadFolder', upload.array('files'), (req, res) => {
  const { path } = req.body;
  console.log(`Uploading folder files to ${path}`, req.files);
  (req.files || []).forEach(file => {
    demoFiles.push({
      id: String(Date.now()),
      type: 'file',
      mimeType: file.mimetype,
      description: 'Uploaded folder file',
      name: file.originalname,
      path: path + '/' + file.originalname,
      fileType: 'file',
      size: file.size,
      modified: new Date().toISOString(),
      tags: []
    });
  });
  refresh();
  res.json({ message: 'uploadFolder success' });
});

// POST /api/copyFile
router.post('/copyFile', (req, res) => {
  const { source, destination } = req.body;
  console.log(`Copying file from ${source} to ${destination}`);
  // Find the source file in our demo data
  const srcFile = demoFiles.find(file => file.path === source);
  if (srcFile) {
    // Create a copy with a new id and destination path
    const copiedFile = {
      ...srcFile,
      id: String(Date.now()),
      path: destination,
      name: destination.split('/').pop()
    };
    demoFiles.push(copiedFile);
    refresh();
    res.json({ message: 'copyFile success' });
  } else {
    res.status(404).json({ error: 'Source file not found' });
  }
});

// POST /api/moveFile
router.post('/moveFile', (req, res) => {
  const { source, destination } = req.body;
  console.log(`Moving file from ${source} to ${destination}`);
  let moved = false;
  demoFiles = demoFiles.map(file => {
    if (file.path === source) {
      moved = true;
      return {
        ...file,
        path: destination,
        name: destination.split('/').pop()
      };
    }
    return file;
  });
  refresh();
  if (moved) {
    res.json({ message: 'moveFile success' });
  } else {
    res.status(404).json({ error: 'Source file not found' });
  }
});

// POST /api/updateTags
router.post('/updateTags', (req, res) => {
  const { path, tags } = req.body;
  console.log(`Updating tags for ${path}:`, tags);
  demoFiles = demoFiles.map(file => {
    if (file.path === path) {
      return { ...file, tags };
    }
    return file;
  });
  refresh();
  res.json({ message: 'updateTags success' });
});

export default router;
