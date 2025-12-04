import logo from "../assets/img/logo_no_background.webp"

function Footer() {

    return (
        <div>
            <footer className="footer bg-gray-100 text-neutral-content flex justify-center fixed bottom-0 w-full">
                <aside className="flex items-center gap-4">
                    <img src={logo} alt="logo" className="w-20 h-20 object-cover" />
                    <p className="text-blue-600 font-medium">
                        Copyright © made by Yeray Carrión Cerón and Óscar Gordillo Corral {new Date().getFullYear()} - All right reserved
                    </p>
                </aside>
            </footer>
        </div>
    );
}

export default Footer;