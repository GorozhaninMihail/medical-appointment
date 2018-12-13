const DoctorService = require('../../api/services/DoctorService');
const UserService = require('../../api/services/UserService');
const assert = require('assert');


describe('User Functionality', function() {

    describe('#createAccount()', function() {
        it('should create new account', async function () {
            const params = {last_name: 'TEST_account', first_name: 'TEST_account', middle_name: 'TEST_account',
                email: 'TESTACCOUNT@email.com', phone_number: '+79999999999', password: 'TEST', type: 'user'};
            let result = await UserService.createAccount(params);
            assert(result.rowCount > 0);
        });
    }); 

    describe('#changeAccountRole()', function() {
        it('should change account role to doctor', async function () {
            var userList = await UserService.getUserByName('TEST_account');
            (async function() {
                for(var i = 0; i < userList.length; ++i) {
                    await UserService.setUserRole(userList[i].id, 'doctor');
                }
            })();
            
            userList = await UserService.getUserByName('TEST_account');
            (async function() {
                for(var i = 0; i < userList.length; ++i) {
                    await UserService.setUserRole(userList[i].id, 'user');
                }
            })();
            assert(userList.length > 0);
        });
    });  

    describe('#deleteAccount()', function() {
        it('should delete account', async function () {
            var userList = await UserService.getUserByName('TEST_account');
            assert(userList.length > 0);
            /*userList.forEach(async function(user) {
                await UserService.deleteAccount(user.id);
            });*/
            await (async function() {
                for(var i = 0; i < userList.length; ++i) {
                    await UserService.deleteAccount(userList[i].id);
                }
            })();
            
            userList = await UserService.getUserByName('TEST_account');
            assert(userList.length === 0);
        });
    }); 
 });