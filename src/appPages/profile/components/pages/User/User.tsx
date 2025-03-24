import { Avatar, Badge, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import scss from "./User.module.scss";
import { useGetMeQuery } from "@/redux/api/auth";

const User = () => {
  const { data: user } = useGetMeQuery();

  return (
    <section className={scss.User}>
      <div className={scss.content}>
        <div className={scss.UserTitle}>
          {user?.map((el, index) => {
            return (
              <div key={el.id || index}>
                <h1>{el.first_name}</h1>
                <p>{el.phone_number}</p>
              </div>
            );
          })}
        </div>
        {Array.isArray(user) &&
          user.map((el, index) => (
            <Space direction="vertical" size={20} key={el.id || index}>
              <Space wrap size={20}>
                <Badge count={1}>
                  <Avatar
                    size={47}
                    icon={
                      el.user_picture ? (
                        <img
                          src={el.user_picture}
                          alt="avatar"
                          width={100}
                          height={100}
                          style={{ objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                </Badge>
              </Space>
            </Space>
          ))}
      </div>
    </section>
  );
};

export default User;
