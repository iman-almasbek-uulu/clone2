import { useState, useEffect } from "react";
import scss from "./VisionProfile.module.scss";
import Image from "next/image";
import edit from "@/assets/icons/Edit.svg";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetMeQuery, usePatchMeMutation } from "@/redux/api/auth";
import { useForm } from "react-hook-form";

const VisionProfile = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const { data: user } = useGetMeQuery();
  const [PatchMeRequest] = usePatchMeMutation();

  const { register, watch } = useForm<AUTH.PatchMeRequest>();

  const coverPhotoFile = watch("cover_photo");
  const userPhotoFile = watch("user_picture");

  useEffect(() => {
    if (coverPhotoFile && coverPhotoFile[0]) {
      const file = coverPhotoFile[0] as unknown as File;

      if (file instanceof File) {
        const previewUrl = URL.createObjectURL(file);
        setCoverPreview(previewUrl);

        const formData = new FormData();
        formData.append("cover_photo", file);

        const sendFileToServer = async () => {
          try {
            const response = await PatchMeRequest(
              formData as unknown as AUTH.PatchMeRequest
            );
            if (response.data) {
              console.log("Фото фона успешно загружено!");
              // setCoverPreview(response.data.cover_photo);
            }
          } catch (e) {
            console.error("Ошибка при загрузке фото фона:", e);
            setCoverPreview(null);
          }
        };

        sendFileToServer();
      } else {
        console.error("Выбранный объект не является файлом.");
      }
    }
  }, [coverPhotoFile, PatchMeRequest]);

  useEffect(() => {
    if (userPhotoFile && userPhotoFile[0]) {
      const file = userPhotoFile[0] as unknown as File;

      if (file instanceof File) {
        const previewUrl = URL.createObjectURL(file);
        setUserPreview(previewUrl);

        const formData = new FormData();
        formData.append("user_picture", file);

        const sendFileToServer = async () => {
          try {
            const response = await PatchMeRequest(
              formData as unknown as AUTH.PatchMeRequest
            );
            if (response.data) {
              console.log("Аватарка успешно загружена!");
              // setUserPreview(response.data.user_picture);
            }
          } catch (e) {
            console.error("Ошибка при загрузке аватарки:", e);
            setUserPreview(null);
          }
        };

        sendFileToServer();
      } else {
        console.error("Выбранный объект не является файлом.");
      }
    }
  }, [userPhotoFile, PatchMeRequest]);

  return (
    <section className={scss.VisionProfile}>
      {user?.map((el, index) => (
        <div className={scss.content} key={el.id || index}>
          <div
            className={scss.cover}
            style={{
              backgroundImage: coverPreview
                ? `url(${coverPreview})`
                : el.cover_photo
                ? `url(${el.cover_photo})`
                : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <label className={scss.EditCover}>
              Edit Cover Photo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                {...register("cover_photo")}
              />
            </label>
          </div>

          <div className={scss.EditImage}>
            <Space direction="vertical" size={16}>
              <Space wrap size={16}>
                <label>
                  <Avatar
                    className={scss.avatar}
                    icon={
                      userPreview ? (
                        <img src={userPreview} alt="avatar" />
                      ) : el.user_picture ? (
                        <img src={el.user_picture} alt="avatar" />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    {...register("user_picture")}
                  />
                </label>
              </Space>
            </Space>
            <div className={scss.userName}>
              <h1>
                {el.first_name} {el.last_name}
              </h1>
              <p>{!el.from_user ? "Страна, город" : el.from_user}</p>
            </div>
          </div>

          <button className={scss.EditFrom}>
            <Image src={edit} alt="edit" />
          </button>
        </div>
      ))}
    </section>
  );
};

export default VisionProfile;
