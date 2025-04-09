"use client";
import { useState, useEffect, useRef, useCallback, ElementRef } from "react";
import scss from "./VisionProfile.module.scss";
import Image from "next/image";
import edit from "@/assets/icons/Edit.svg";
import { Avatar, Space, Modal, Input, Button, List, Spin, message, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetMeQuery, usePatchMeMutation } from "@/redux/api/auth";
import { useForm, Controller } from "react-hook-form";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import debounce from "lodash/debounce";
import Cropper, { Area } from 'react-easy-crop';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface FormValues {
  from_user?: string;
  user_picture?: File;
  cover_photo?: File;
}

const VisionProfile = () => {
  const { t } = useTranslate();
  const { data: user } = useGetMeQuery();
  const [PatchMeRequest] = usePatchMeMutation();
  
  const { control, setValue, watch } = useForm<FormValues>();
  const fromUserValue = watch("from_user");

  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<ElementRef<typeof Input>>(null);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);

  const searchLocations = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
          { headers: { 'User-Agent': 'YourAppName/1.0 (your@email.com)' } }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setSuggestions(await response.json());
      } catch (error) {
        console.error("Search error:", error);
        message.error(t("Ошибка при поиске местоположения", "خطأ في البحث عن الموقع", "Location search error"));
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [t]
  );

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const openCoverModal = () => {
    setIsCoverModalOpen(true);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleAvatarCancel = () => {
    setIsAvatarModalOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleCoverCancel = () => {
    setIsCoverModalOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleAvatarSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], 'avatar.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('user_picture', file);

      await PatchMeRequest(formData as unknown as AUTH.PatchMeRequest);
      message.success(t("Аватар обновлен", "تم تحديث الصورة الشخصية", "Avatar updated"));
      
      const previewUrl = URL.createObjectURL(croppedImage);
      setUserPreview(previewUrl);
    } catch (error) {
      console.error("Avatar upload error:", error);
      message.error(t("Ошибка загрузки", "خطأ في التحميل", "Upload error"));
    } finally {
      setIsAvatarModalOpen(false);
      setImageSrc(null);
    }
  };

  const handleCoverSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], 'cover.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('cover_photo', file);

      await PatchMeRequest(formData as unknown as AUTH.PatchMeRequest);
      message.success(t("Фон обновлен", "تم تحديث الخلفية", "Cover updated"));
      
      const previewUrl = URL.createObjectURL(croppedImage);
      setCoverPreview(previewUrl);
    } catch (error) {
      console.error("Cover upload error:", error);
      message.error(t("Ошибка загрузки", "خطأ في التحميل", "Upload error"));
    } finally {
      setIsCoverModalOpen(false);
      setImageSrc(null);
    }
  };

  const beforeImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    return false;
  };

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
      message.error(t("Геолокация не поддерживается", "تحديد الموقع غير مدعوم", "Geolocation not supported"));
      setIsManualInput(true);
      setIsLocationModalOpen(true);
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
        { headers: { 'User-Agent': 'YourAppName/1.0 (your@email.com)' } }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const country = data.address?.country;
      const city = data.address?.city || data.address?.town || data.address?.village;

      if (country && city) {
        setDetectedLocation(`${country}, ${city}`);
        setIsLocationModalOpen(true);
      } else {
        throw new Error("Location data incomplete");
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      message.error(t("Ошибка определения местоположения", "خطأ в تحديد الموقع", "Location detection error"));
      setIsManualInput(true);
      setIsLocationModalOpen(true);
    }
  };

  const handleLocationConfirm = async () => {
    if (!detectedLocation) return;

    try {
      await PatchMeRequest({ from_user: detectedLocation } as AUTH.PatchMeRequest);
      setIsLocationModalOpen(false);
      setValue("from_user", detectedLocation);
      message.success(t("Местоположение сохранено", "تم حفظ الموقع", "Location saved"));
    } catch (error) {
      console.error("Save error:", error);
      message.error(t("Ошибка сохранения", "خطأ في الحفظ", "Save error"));
    }
  };

  const handleManualLocationSave = async () => {
    if (!manualLocation.trim()) return;

    try {
      await PatchMeRequest({ from_user: manualLocation } as AUTH.PatchMeRequest);
      setIsLocationModalOpen(false);
      setIsManualInput(false);
      setSuggestions([]);
      setValue("from_user", manualLocation);
      message.success(t("Местоположение сохранено", "تم حفظ الموقع", "Location saved"));
    } catch (error) {
      console.error("Save error:", error);
      message.error(t("Ошибка сохранения", "خطأ في الحفظ", "Save error"));
    }
  };

  useEffect(() => {
    if (user?.[0]) {
      setValue("from_user", user[0].from_user || "");
      if (!user[0].from_user) {
        fetchLocation();
      }
    }
  }, [user, setValue, fetchLocation]);

  return (
    <section className={scss.VisionProfile}>
      <Modal
        title={t("Подтвердите местоположение", "تأكيد الموقع", "Confirm location")}
        open={isLocationModalOpen}
        onCancel={() => {
          setIsLocationModalOpen(false);
          setSuggestions([]);
        }}
        footer={
          isManualInput ? (
            <Button
              type="primary"
              onClick={handleManualLocationSave}
              disabled={!manualLocation.trim()}
              loading={isSearching}
              style={{ 
                backgroundColor: !manualLocation ? '' : 'var(--main-color)',
                borderColor: !manualLocation ? '' : 'var(--main-color)',
                color: !manualLocation ? '' : 'var(--background)'
              }}
            >
              {t("Сохранить", "حفظ", "Save")}
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsLocationModalOpen(false)}>
                {t("Отмена", "إلغاء", "Cancel")}
              </Button>
              <Button type="primary" onClick={handleLocationConfirm}>
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
            <Controller
              name="from_user"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  ref={inputRef}
                  value={manualLocation}
                  onChange={(e) => {
                    field.onChange(e);
                    handleManualLocationChange(e);
                  }}
                  placeholder={t("Страна, город", "البلد، المدينة", "Country, city")}
                />
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
            <p>{t("Это верно?", "هل هذا صحيح؟", "Is this correct?")}</p>
          </div>
        )}
      </Modal>

      <Modal
        title={t("Редактировать аватар", "تعديل الصورة الشخصية", "Edit avatar")}
        open={isAvatarModalOpen}
        onCancel={handleAvatarCancel}
        width={900}
        styles={{ body: { height: '500px' } }}
        footer={[
          <Button key="cancel" onClick={handleAvatarCancel}>
            {t("Отмена", "إلغاء", "Cancel")}
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleAvatarSave}
            disabled={!imageSrc}
            style={{ 
              backgroundColor: !imageSrc ? '' : 'var(--main-color)',
              borderColor: !imageSrc ? '' : 'var(--main-color)',
              color: !imageSrc ? '' : 'var(--background)'
            }}
          >
            {t("Сохранить", "حفظ", "Save")}
          </Button>,
        ]}
      >
        <div className={scss.imageUploadContainer}>
          {!imageSrc ? (
            <Upload.Dragger
              accept="image/*"
              beforeUpload={beforeImageUpload}
              showUploadList={false}
              className={scss.uploadArea}
            >
              <p className="ant-upload-text">
                {t("Перетащите изображение сюда или нажмите", "اسحب الصورة هنا أو انقر", "Drag image here or click")}
              </p>
              <p className="ant-upload-hint">
                {t("Загрузите изображение для аватара", "قم بتحميل صورة للصورة الشخصية", "Upload an avatar image")}
              </p>
            </Upload.Dragger>
          ) : (
            <div className={scss.cropperContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
              />
              <div className={scss.controls}>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={scss.zoomSlider}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={t("Редактировать фон", "تعديل الخلفية", "Edit cover")}
        open={isCoverModalOpen}
        onCancel={handleCoverCancel}
        width={1000}
        styles={{ body: { height: '500px' } }}
        footer={[
          <Button
           key="cancel" onClick={handleCoverCancel}>
            {t("Отмена", "إلغاء", "Cancel")}
          </Button>,
          <Button
            className="Btn"
            key="save"
            type="primary"
            onClick={handleCoverSave}
            disabled={!imageSrc}
            style={{ 
              backgroundColor: !imageSrc ? '' : 'var(--main-color)',
              borderColor: !imageSrc ? '' : 'var(--main-color)',
              color: !imageSrc ? '' : 'var(--background)'
            }}
          >
            {t("Сохранить", "حفظ", "Save")}
          </Button>,
        ]}
      >
        <div className={scss.imageUploadContainer}>
          {!imageSrc ? (
            <Upload.Dragger
              accept="image/*"
              beforeUpload={beforeImageUpload}
              showUploadList={false}
              className={scss.uploadArea}
            >
              <p className="ant-upload-text">
                {t("Перетащите изображение сюда или нажмите", "اسحب الصورة هنا أو انقر", "Drag image here or click")}
              </p>
              <p className="ant-upload-hint">
                {t("Загрузите фоновое изображение", "قم بتحميل صورة للخلفية", "Upload a cover image")}
              </p>
            </Upload.Dragger>
          ) : (
            <div className={scss.cropperContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={55 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
              />
              <div className={scss.controls}>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className={scss.zoomSlider}
                />
              </div>
            </div>
          )}
        </div>
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
            <button 
              className={scss.EditCover}
              onClick={openCoverModal}
            >
              {t("Изменить обложку", "تغيير الغلاف", "Change cover")}
            </button>
          </div>

          <div className={scss.EditImage}>
            <Space direction="vertical" size={16}>
              <Space wrap size={16}>
                <label onClick={openAvatarModal}>
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
                </label>
              </Space>
            </Space>
            <div className={scss.userName}>
              <h1>
                {el.first_name} {el.last_name}
              </h1>
              <p>{fromUserValue || t("Страна, город", "البلد، المدينة", "Country, City")}</p>
            </div>
          </div>

          <button
            className={scss.EditFrom}
            onClick={() => {
              setIsManualInput(true);
              setManualLocation(fromUserValue || "");
              setIsLocationModalOpen(true);
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