import logo from "../assets/img/logo_no_background.webp"

function Footer() {

    return (
        <div>
            <footer className="footer bg-neutral text-neutral-content bg-sky-600 p-4 flex justify-center ">
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