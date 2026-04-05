import User from '../models/user.model.js';

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data:users });
    }catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
}
const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data:user });
    }catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
}
const updateUser = async (req, res) => {
    try{
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
        if(!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated', data:user });
    }catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
}
const deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted' });
    }catch(err){
        res.status(500).json({ success: false, message: err.message });
    }
}

export { getAllUsers, getUserById, updateUser, deleteUser };