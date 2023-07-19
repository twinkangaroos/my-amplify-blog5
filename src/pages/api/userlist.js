import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';

const UserList = async(req, res) => {
    try{
        const client = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
        //const command = new ListUsersCommand({ UserPoolId: 'ap-northeast-1_IMfdWN6uC' }); // Staging
        const command = new ListUsersCommand({ UserPoolId: 'ap-northeast-1_0BdVQcI2U' }); // Dev
        const response = await client.send(command);
        const userList = response.Users;
        if (userList) {
          return res.status(200).json({message: "ユーザーリスト取得成功", userList: userList})
        }
        else {
          return res.status(400).json({message: "ユーザーリスト取得失敗"})  
        }
    } catch(err){
        return res.status(400).json({message: err})
    }
}

export default UserList;
