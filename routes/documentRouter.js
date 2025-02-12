// documentRouter.js
import { Router } from 'express';

const router = Router();

// Dummy text for demonstration. Replace this with your actual data retrieval logic.
const dummyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. 
Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. 
Integer in mauris eu nibh euismod gravida.`;

// GET /api/doc/:doc_id
router.get('/doc/:doc_id', async (req, res) => {
  try {
    const { doc_id } = req.params;
    // In a real implementation, you might fetch the document from a database.
    // For now, we use dummyText. For example:
    // const docContent = await getDocumentById(doc_id);
    const docContent = dummyText;

    res.json({ content: docContent });
  } catch (error) {
    console.error('Failed to fetch document:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
