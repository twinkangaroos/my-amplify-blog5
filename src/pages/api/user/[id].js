import { CognitoIdentityProviderClient, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider'

const User = async(req, res) => {
    try{
        const client = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' })
        const params = {
            //UserPoolId: "ap-northeast-1_IMfdWN6uC", // Staging
            UserPoolId: "ap-northeast-1_0BdVQcI2U", // Dev
            Username: req.query.id,
        };
        //■AdminGetUserCommand | @aws-sdk/client-cognito-identity-provider
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/classes/admingetusercommand.html
        const command = new AdminGetUserCommand(params)
        const response = await client.send(command)
        console.log(response)
        const user = {
            Username: response.Username, // unique id
            email: response.UserAttributes.find(attr => attr.Name === 'email')?.Value || '',
            email_verified: response.UserAttributes.find(attr => attr.Name === 'email_verified')?.Value || '',
            custom_group: response.UserAttributes.find(attr => attr.Name === 'custom:group')?.Value || '',
            UserStatus: response.UserStatus,
            Enabled: response.Enabled,
            UserCreateDate: response.UserCreateDate,
            UserLastModifiedDate: response.UserLastModifiedDate,
        }
        console.log(user)
        if (user) {
          return res.status(200).json({message: "ユーザー取得成功", user: user})
        }
        else {
          return res.status(400).json({message: "ユーザー取得失敗"})  
        }
    } catch(err){
        return res.status(400).json({message: err})
    }
}

export default User
