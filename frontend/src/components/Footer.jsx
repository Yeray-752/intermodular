import logo from "../assets/img/logo_no_background.webp"

function Footer() {

    return (
        <div>
            <footer className="footer bg-sky-600 text-neutral-content flex justify-center fixed bottom-0 w-full">
                <aside className="flex items-center gap-4">
                    <img src={logo} alt="logo" className="w-32 h-32 object-cover" />
                    <p>
                        Copyright © made by Yeray Carrión Cerón and Óscar Gordillo Corral {new Date().getFullYear()} - All right reserved
                    </p>
                </aside>
            </footer>
        </div>
    );
}

export default Footer;