const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid')
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

async function getJsonContent () {
    const content = await readFile('tasks.json', 'utf-8')
    return JSON.parse(content);
}

async function updateContent (content) {
    return writeFile('tasks.json', JSON.stringify(content, null));
}

router.get("/", async (req, res) => {
    try {
        const content = await getJsonContent();
        console.log(content)
        res.send(content)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
});

router.post("/", async (req, res) => {
    try {
        const task = req.body
        const content = await getJsonContent()
        // We do not spread task directly for security purposes
        const newTask = {
            task: task.task,
            completed: task.completed || false,
            id: uuid.v4(),
        }
        content.push(newTask)

        await updateContent(content);
        res.send(newTask);
    } catch (error) {
        console.error(error)
        res.status(500)
    }
});

router.put("/:id", async (req, res) => {
    try {
        const content = await getJsonContent();
        const taskId = (element) => element.id == req.params.id
        const index = content.findIndex(taskId)
        content[index] = {
            ...content[index],
            completed: req.body.completed,
        }
        // write content
        const updatedContent = await updateContent(content);
        res.send(updatedContent)
        
    } catch (error) {
        console.error(error)
        res.status(500)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const content = await getJsonContent();
        const updatedContent = content.filter(task => task.id !== req.params.id);
        const updatedData = await updateContent(updatedContent);
        res.send(updatedData)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
});

module.exports = router;