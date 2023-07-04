module.exports = class UserDto{
    email;
    id;
    isActivated;
    firstName;
    lastName;
    avatar;
    constructor(modal) {
        this.email = modal.email;
        this.id = modal._id;
        this.isActivated = modal.isActivated;
        this.firstName = modal.firstName;
        this.lastName = modal.lastName;
        this.avatar = modal.avatar;
    }
}
