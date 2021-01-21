const FriendShip = require('../models/friendship');
const User = require('../models/user');

module.exports.addFriend = async (req, res) => {
    try {
        let to_user = await User.findById(req.params.id);
        let from_user = await User.findById(req.user._id);
        let addedFriend = false;
        let fr = await FriendShip.findOne({ to_user, from_user });
        if (fr) {
            to_user.friendships.pull(fr._id);
            from_user.friendships.pull(fr._id);
            await to_user.save();
            await from_user.save();
            fr.remove();
            return res.json({
                addedFriend
            });
        }
        let friendship = await FriendShip.create({
            from_user,
            to_user
        });
        to_user.friendships.push(friendship);
        await to_user.save();
        from_user.friendships.push(friendship);
        await from_user.save();
        addedFriend = true;
        return res.json({
            addedFriend
        })
    }
    catch (err) {
        console.log('error', err);
    }
}
