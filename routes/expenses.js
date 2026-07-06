const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware'); // Bring in the bouncer!

// 1. GET all expenses for the LOGGED IN user
router.get('/', auth, async (req, res) => {
    try {
        // Find only expenses where the user ID matches the VIP pass
        const expenses = await Expense.find({ user: req.user.id }); 
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADD a new expense for the LOGGED IN user
router.post('/', auth, async (req, res) => {
    try {
        const newExpense = new Expense({
            text: req.body.text,
            amount: req.body.amount,
            type: req.body.type,
            user: req.user.id // Attach the user's ID to the expense before saving
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE an expense (making sure they own it)
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        
        // Ensure the person trying to delete it is the actual owner
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;