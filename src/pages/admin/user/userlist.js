import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link'
import { Table, TableCell, TableBody, TableHead, TableRow } from '@aws-amplify/ui-react';

const UserList = (props) => {
  
  return (
      <div>
        <h1>ログインユーザー一覧</h1>
        <Table
            caption={""}
            highlightOnHover={true}
            size={"small"}
            variation={"striped"}
        >
          <TableHead>
              <TableRow>
              {/*
              <TableCell as="th">id</TableCell>
              */}
              <TableCell as="th">Eメールアドレス</TableCell>
              <TableCell as="th">Eメール確認済み</TableCell>
              <TableCell as="th">グループ</TableCell>
              <TableCell as="th">確認ステータス</TableCell>
              <TableCell as="th">ステータス</TableCell>
              {/*
              <TableCell as="th">作成日時</TableCell>
              <TableCell as="th">更新日時</TableCell>
              */}
              </TableRow>
          </TableHead>
          <TableBody>
          {
              props.userList.map(user => (
                  <TableRow key={user.Username}>
                      <TableCell><Link href={`/admin/user/update/${user.Username}`}>{user.Attributes.find(attr => attr.Name === 'email').Value}</Link></TableCell>
                      {user.Attributes.find(attr => attr.Name === 'email_verified') && user.Attributes.find(attr => attr.Name === 'email_verified').Value ? (
                        <TableCell>検証済み</TableCell>
                      ) : (
                        <TableCell>未検証</TableCell>
                      )}
                      {user.Attributes.find(attr => attr.Name === 'custom:group') ? (
                        <TableCell>{user.Attributes.find(attr => attr.Name === 'custom:group').Value}</TableCell>
                      ) : (
                        <TableCell>未設定</TableCell>
                      )}
                      {user.UserStatus === 'FORCE_CHANGE_PASSWORD' ? (
                        <TableCell>パスワードを強制的に変更</TableCell>
                      ) : user.UserStatus === 'CONFIRMED' ? (
                        <TableCell>確認済み</TableCell>
                      ) : (
                        <TableCell>（不明）</TableCell>
                      )}
                      {user.Enabled ? (
                        <TableCell>有効</TableCell>
                      ) : (
                        <TableCell>無効</TableCell>
                      )}
                  </TableRow>
              ))
          }
          </TableBody>
        </Table>
      </div>
  )
}

export default UserList

export const getServerSideProps = async(context) => {
    const { req } = context
    const protocol = req.headers["x-forwarded-proto"] || "https" // プロトコルを取得 (リバースプロキシを考慮)
    const host = req.headers["x-forwarded-host"] || req.headers.host // ホストを取得 (リバースプロキシを考慮)
    const apiUrl = `${protocol}://${host}/api/userlist`
    const response = await fetch(apiUrl)
    const userList = await response.json()
    /*
        console.log(userList[1].Attributes)
        const UserList =
        {
            message: 'ユーザーリスト取得成功',
            userList: [
              {
                Attributes: [Array],
                Enabled: true,
                UserCreateDate: '2023-07-14T14:35:22.006Z',
                UserLastModifiedDate: '2023-07-14T14:35:22.006Z',
                UserStatus: 'FORCE_CHANGE_PASSWORD',
                Username: '37b48ad8-c0b1-7043-beb4-d8affd973f64'
              },
            ]
        }
        // Attributes:
        [
          { Name: 'sub', Value: '6704fac8-60f1-70b3-5bb0-6003ffc69fd3' },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'custom:group', Value: 'グループB' },
          { Name: 'email', Value: 'kawamura.takeo1@gmail.com' }
        ]
    */
    return {
        props: userList
    }
}
