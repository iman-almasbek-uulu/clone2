"use client";
import { useState, useEffect, useRef, useCallback, ElementRef } from "react";
import scss from "./VisionProfile.module.scss";
import Image from "next/image";
import edit from "@/assets/icons/Edit.svg";
import { Avatar, Space, Modal, Input, Button, List, Spin, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetMeQuery, usePatchMeMutation } from "@/redux/api/auth";
import { useForm } from "react-hook-form";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import debounce from "lodash/debounce";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const VisionProfile = () => {
  const { t } = useTranslate();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const { data: user } = useGetMeQuery();
  const [PatchMeRequest] = usePatchMeMutation();
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<ElementRef<typeof Input>>(null);

  const { register, watch } = useForm<AUTH.PatchMeRequest>();

  const searchLocations = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              'User-Agent': 'YourAppName/1.0 (your@email.com)'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Search error:", error);
        message.error(
          t(
            "Ошибка при поиске местоположения",
            "خطأ في البحث عن الموقع",
            "Location search error"
          )
        );
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [t]
  );

  const handleManualLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualLocation(value);
    searchLocations(value);
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setManualLocation(location.display_name);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      message.error(
        t(
          "Геолокация не поддерживается",
          "تحديد الموقع غير مدعوم",
          "Geolocation not supported"
        )
      );
      setIsManualInput(true);
      setIsModalOpen(true);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const country = data.address?.country;
      const city = data.address?.city || data.address?.town || data.address?.village;

      if (country && city) {
        setDetectedLocation(`${country}, ${city}`);
        setIsModalOpen(true);
      } else {
        throw new Error("Location data incomplete");
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      message.error(
        t(
          "Ошибка определения местоположения",
          "خطأ في تحديد الموقع",
          "Location detection error"
        )
      );
      setIsManualInput(true);
      setIsModalOpen(true);
    }
  };

  const handleLocationConfirm = async () => {
    if (!detectedLocation) return;

    try {
      await PatchMeRequest({
        from_user: detectedLocation,
      } as AUTH.PatchMeRequest);
      setIsModalOpen(false);
      message.success(
        t(
          "Местоположение сохранено",
          "تم حفظ الموقع",
          "Location saved"
        )
      );
    } catch (error) {
      console.error("Save error:", error);
      message.error(
        t(
          "Ошибка сохранения",
          "خطأ في الحفظ",
          "Save error"
        )
      );
    }
  };

  const handleManualLocationSave = async () => {
    if (!manualLocation.trim()) return;

    try {
      await PatchMeRequest({
        from_user: manualLocation,
      } as AUTH.PatchMeRequest);
      setIsModalOpen(false);
      setIsManualInput(false);
      setSuggestions([]);
      message.success(
        t(
          "Местоположение сохранено",
          "تم حفظ الموقع",
          "Location saved"
        )
      );
    } catch (error) {
      console.error("Save error:", error);
      message.error(
        t(
          "Ошибка сохранения",
          "خطأ في الحفظ",
          "Save error"
        )
      );
    }
  };

  useEffect(() => {
    if (user?.[0] && !user[0].from_user) {
      fetchLocation();
    }
  }, [user]);

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
              message.success(
                t(
                  "Фото фона загружено",
                  "تم تحميل صورة الخلفية",
                  "Cover photo uploaded"
                )
              );
            }
          } catch (e) {
            console.error("Upload error:", e);
            message.error(
              t(
                "Ошибка загрузки",
                "خطأ في التحميل",
                "Upload error"
              )
            );
            setCoverPreview(null);
          }
        };

        sendFileToServer();
      }
    }
  }, [coverPhotoFile, PatchMeRequest, t]);

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
              message.success(
                t(
                  "Аватар загружен",
                  "تم تحميل الصورة الشخصية",
                  "Avatar uploaded"
                )
              );
            }
          } catch (e) {
            console.error("Upload error:", e);
            message.error(
              t(
                "Ошибка загрузки",
                "خطأ في التحميل",
                "Upload error"
              )
            );
            setUserPreview(null);
          }
        };

        sendFileToServer();
      }
    }
  }, [userPhotoFile, PatchMeRequest, t]);

  return (
    <section className={scss.VisionProfile}>
      <Modal
        title={t(
          "Подтвердите местоположение",
          "تأكيد الموقع",
          "Confirm location"
        )}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSuggestions([]);
        }}
        footer={
          isManualInput ? (
            <Button
              type="primary"
              onClick={handleManualLocationSave}
              disabled={!manualLocation.trim()}
              loading={isSearching}
            >
              {t("Сохранить", "حفظ", "Save")}
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsModalOpen(false)}>
                {t("Отмена", "إلغاء", "Cancel")}
              </Button>
              <Button 
                type="primary" 
                onClick={handleLocationConfirm}
              >
                {t("Подтвердить", "تأكيد", "Confirm")}
              </Button>
              <Button
                onClick={() => {
                  setIsManualInput(true);
                  setManualLocation(detectedLocation || "");
                }}
              >
                {t("Ввести вручную", "إدخال يدوي", "Enter manually")}
              </Button>
            </>
          )
        }
      >
        {isManualInput ? (
          <div className={scss.locationSearchContainer}>
            <Input
              ref={inputRef}
              value={manualLocation}
              onChange={handleManualLocationChange}
              placeholder={t(
                "Страна, город",
                "البلد، المدينة",
                "Country, city"
              )}
            />
            
            {isSearching ? (
              <Spin style={{ margin: "10px 0" }} />
            ) : suggestions.length > 0 ? (
              <List
                className={scss.suggestionsList}
                dataSource={suggestions}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleLocationSelect(item)}
                    className={scss.suggestionItem}
                  >
                    {item.display_name}
                  </List.Item>
                )}
              />
            ) : manualLocation.trim() ? (
              <p className={scss.noResults}>
                {t("Ничего не найдено", "لا توجد نتائج", "No results found")}
              </p>
            ) : null}
          </div>
        ) : (
          <div className={scss.detectedLocation}>
            <p>{detectedLocation}</p>
            <p>
              {t("Это верно?", "هل هذا صحيح؟", "Is this correct?")}
            </p>
          </div>
        )}
      </Modal>

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
              {t(
                "Изменить обложку",
                "تغيير الغلاف",
                "Change cover"
              )}
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
              <p>{el.from_user || t("Страна, город", "البلد، المدينة", "Country, City")}</p>
            </div>
          </div>

          <button
            className={scss.EditFrom}
            onClick={() => {
              setIsManualInput(true);
              setManualLocation(el.from_user || "");
              setIsModalOpen(true);
            }}
          >
            <Image src={edit} alt="edit" />
          </button>
        </div>
      ))}
    </section>
  );
};

export default VisionProfile;