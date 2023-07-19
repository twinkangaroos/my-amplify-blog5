import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from '../../../../aws-exports';
Amplify.configure(awsconfig);
import { Card, View, Text, Flex, Badge, TextField, Button, useTheme, SelectField, SwitchField } from '@aws-amplify/ui-react';
//import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore';
//import { MShop } from '../../../../models';
import { Auth } from 'aws-amplify';

const UpdateUser = (props) => {
    const [username, setUsername] = useState("")
    //const [shop_id, setShopId] = useState("")
    //const [shops, setShops] = useState([])
    //const [area, setArea] = useState("")
    //const [areas, setAreas] = useState([])
    const [email, setEmail] = useState("")
    
    const { tokens } = useTheme();
    
    // 初期ロード時の処理
    useEffect(() => {
        setUsername(props.user.Username)
        setEmail(props.user.email)
        // 店舗マスタの取得
        //fetchShop()
    }, []);

    // 店舗マスタ取得
    async function fetchShop() {
        if (!props.user.custom_group) {
            // do nothing...
        }
        else {
            // ユーザー所属の店舗マスタのidをセット（念のためマスタ存在チェック）
            //const my_shop = await DataStore.query(MShop, (c) => c.id.eq(props.user.custom_group))
            //if (my_shop) {
                //setShopId(my_shop[0].id)
                //setArea(my_shop[0].area)
            //}
            setShopId(props.user.custom_group)
        }
        //　リストボックス用店舗マスタ取得
        //const m_shop = await DataStore.query(MShop, Predicates.ALL, {
        //    sort:(s) => s.area(SortDirection.ASCENDING).prefecture(SortDirection.ASCENDING).shop(SortDirection.ASCENDING),
        //})
        //setShops(m_shop)
        // リストボックス用エリアマスタ全取得（制御がややこしいのでペンディング）
        //const m_area = await DataStore.query(MArea, Predicates.ALL, {
        //    sort:(s) => s.area(SortDirection.ASCENDING),
        //})
        //setAreas(m_area)
    }

    // 更新ボタンクリック
    const onUClick = async (e) => {
        e.preventDefault();
        try {
            console.log("username=", username)
            console.log("update email=", email)
            //console.log("shop_id=", shop_id)

            // ログインユーザーでアクセストークン作成（TODO：管理者であることを確認要）。
            const currentSession = await Auth.currentSession();
            const accessToken = currentSession.getAccessToken().getJwtToken();

            // 別のユーザーでログインしてアクセストークンを作ろうとすると、以下のエラーが発生するので使えない。
            // InvalidParameterException: Custom auth lambda trigger is not configured for the user pool.
            //const res = await Auth.signIn(username);
            //const accessToken = res.signInUserSession.getAccessToken().getJwtToken();
            
            //console.log("accesstoken=", accessToken)

            // アクセストークンを使わないと以下のエラー発生するので必須。
            // ReferenceError: accessToken is not defined
            
            const response = await fetch('/api/user/update_user', {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": 'application/json',
                    "Authorization": accessToken,
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    //shop_id: shop_id,
                }),
            })
            const jsonData = await response.json()
            //alert(jsonData.message)
            console.log('ユーザー属性の更新が成功しました');
        } catch (error) {
            console.error('ユーザー属性の更新時にエラーが発生しました:', error);
        }
    }

    // 削除ボタンクリック
    const onDClick = () => {
        console.log("TODO:delete...")
    }

    return (
        <>
          <h1>ユーザーマスタ編集画面</h1>
          <div>
            <View
                backgroundColor={tokens.colors.background.secondary}
                padding={tokens.space.medium}
                >
                <Card>
                    <Flex direction="column" alignItems="flex-start">
                        <TextField
                            placeholder="xxx@gmail.com"
                            label="メールアドレス"
                            errorMessage="There is an error"
                            defaultValue={props.user.email}
                            width="300px"
                            onChange={e => setEmail(e.target.value)}
                        />
                        {props.user.email_verified === 'true' ? (
                            <Badge size="small" variation="success">メールアドレス検証済み</Badge>
                        ) : (
                            <Badge size="small" variation="warning">メールアドレス未検証</Badge>
                        )}
                        {props.user.UserStatus === 'FORCE_CHANGE_PASSWORD' ? (
                            <Badge size="small" variation="info">パスワードを強制的に変更</Badge>
                        ) : props.user.UserStatus === 'CONFIRMED' ? (
                            <Badge size="small" variation="success">確認済み</Badge>
                        ) : (
                            <Badge size="small" variation="success">？</Badge>
                        )}
                        {props.user.Enabled ? (
                            <Badge size="small" variation="success">アカウント有効</Badge>
                        ) : (
                            <Badge size="small" variation="error">アカウント無効</Badge>
                        )}
                        <SwitchField
                            label="アカウントを有効化する"
                            labelPosition="start"
                            trackColor="#ccc"
                            trackCheckedColor={tokens.colors.gray}
                            defaultChecked={props.user.Enabled}
                        />

                        
                        <Text>
                            作成時刻：{props.user.UserCreateDate}
                        </Text>
                        <Text>
                            最終更新時刻：{props.user.UserLastModifiedDate}
                        </Text>
                        <Flex direction="row" alignItems="flex-start">
                            <Button variation="primary" onClick={onUClick}>更新する</Button>
                            <Button variation="warning" onClick={onDClick}>削除する</Button>
                        </Flex>
                        
                    </Flex>
                </Card>
            </View>
          </div>
      </>
    )
}

export default UpdateUser

// 先にAPIが実行される
export const getServerSideProps = async(context) => {
    const { req } = context
    const protocol = req.headers["x-forwarded-proto"] || "https" // プロトコルを取得 (リバースプロキシを考慮)
    const host = req.headers["x-forwarded-host"] || req.headers.host // ホストを取得 (リバースプロキシを考慮)
    const apiUrl = `${protocol}://${host}/api/user/${context.query.id}`
    const response = await fetch(apiUrl)
    const user = await response.json()
    //console.log(user)
    /*
        const user = 
        {
            message: 'ユーザー取得成功',
            user: {
                Username: '37b48ad8-c0b1-7043-beb4-d8affd973f64',
                email: 'xxxxxxxx@gmail.com',
                email_verified: '',
                custom_group: '',
                UserStatus: 'FORCE_CHANGE_PASSWORD',
                Enabled: true,
                UserCreateDate: '2023-07-14T14:35:22.006Z',
                UserLastModifiedDate: '2023-07-14T14:35:22.006Z'
            }
        }
    */
    return {
        props: user
    }
}

/**
                        <SelectField
                            label="所属店舗名"
                            size="default"
                            value={shop_id}
                            onChange={(e) => setShopId(e.target.value)}
                        >
                            {
                                shops.map(item => (
                                    <option key={item.id} value={item.id}>{item.shop}（{item.prefecture}）</option>
                                ))
                            }
                        </SelectField>
 */