import scss from './Footer.module.scss';
import inst from "@/assets/images/footerImages/inst.png";
import vk from '@/assets/images/footerImages/vk.png';
import fb from '@/assets/images/footerImages/fc.png';
import mail from '@/assets/images/footerImages/mail.png';
import Link from 'next/link';
import Image from 'next/image'; // Импортируем компонент Image
import useTranslate from '@/appPages/site/hooks/translate/translate';

const Footer = () => {
    const {t} = useTranslate();

    return (
        <footer id={scss.Footer}>
            <div className={scss.logo}>
                <p>logo</p>
                <div className={scss.links}>
                    <a href="https://www.instagram.com/">
                        <Image src={inst.src} alt="inst" width={24} height={24} />
                    </a>
                    <a href="https://vk.com/">
                        <Image src={vk.src} alt="vk" width={24} height={24} />
                    </a>
                    <a href="https://www.facebook.com/">
                        <Image src={fb.src} alt="fb" width={24} height={24} />
                    </a>
                    <a href="mailto:">
                        <Image src={mail.src} alt="mail" width={24} height={24} />
                    </a>
                </div>
            </div>

            <nav>
                <div className={scss.items}>
                    <h4>{t("Главная", "الرئيسية", "Home")}</h4>
                    <div className={scss.navLinks}>
                        <Link href="/#Attractions">{t("Достопримечательности", "المعالم السياحية", "Attractions")}</Link>
                        <Link href="/#Map">{t("Карта", "خريطة", "Map")}</Link>
                    </div>
                </div>
                <div className={scss.items}>
                    <h4>{t("Регионы", "المناطق", "Regions")}</h4>
                    <div className={scss.navLinks}>
                        <Link href="/batken">{t("Баткен", "باتكين", "Batken")}</Link>
                        <Link href="/jalal-Abad">{t("Джалал-Абад", "جلال-أباد", "Jalal-Abad")}</Link>
                        <Link href="/issyk-kul">{t("Иссык-Куль", "إيسيك كول", "Issyk_kul")}</Link>
                        <Link href="/naryn">{t("Нарын", "نارين", "Naryn")}</Link>
                        <Link href="/osh">{t("Ош", "أوش", "Osh")}</Link>
                        <Link href="/talas">{t("Талас", "تالاس", "Talas")}</Link>
                        <Link href="/chui">{t("Чуй", "تشوي", "Chyi")}</Link>
                    </div>
                </div>
                <div className={scss.items}>
                    <h4>{t("Культура", "الثقافة", "Culture")}</h4>
                    <div className={scss.navLinks}>
                        <Link href="/culture/games">{t("Игры", "الألعاب", "Games")}</Link>
                        <Link href="/culture/national_instruments">{t("Национальные инструменты", "الآلات الموسيقية الوطنية", "National Instruments")}</Link>
                        <Link href="/culture/national_clothes">{t("Национальная одежда", "الملابس الوطنية", "National Clothes")}</Link>
                        <Link href="/culture/hand_crafts">{t("Ремесла", "الحرف اليدوية", "Hand Crafts")}</Link>
                        <Link href="/culture/currency">{t("Валюта", "العملة", "Currency")}</Link>
                        <Link href="/culture/kitchen">{t("Кухня", "المطبخ", "Kitchen")}</Link>
                    </div>
                </div>
                <div className={scss.items}>
                    <h4>
                        <Link href="/gallery">{t("Галерея", "معرض الصور", "Gallery")}</Link>
                    </h4>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;