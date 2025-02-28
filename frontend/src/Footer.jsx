import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className=" mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h2 className="text-pink-400 text-xl font-semibold">About Us</h2>
          <p className="text-gray-400 mt-3 text-sm">
            Welcome to [Grand - Hotel], the perfect venue for your dream wedding and special events. We ensure that every occasion is unforgettable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-pink-400 text-xl font-semibold">Quick Links</h2>
          <ul className="text-gray-400 mt-3 text-sm space-y-2">
            <li><a href="#" className="hover:text-pink-300">Home</a></li>
            <li><a href="#" className="hover:text-pink-300">About Us</a></li>
            <li><a href="#" className="hover:text-pink-300">Services</a></li>
            <li><a href="#" className="hover:text-pink-300">Gallery</a></li>
            <li><a href="#" className="hover:text-pink-300">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-pink-400 text-xl font-semibold">Contact Us</h2>
          <p className="text-gray-400 mt-3 text-sm">Address: [Prayagraj, Uttar Pradesh]</p>
          <p className="text-gray-400 text-sm">Phone: [+91 9450460987]</p>
          <p className="text-gray-400 text-sm">Email: [support.hotel@.com]</p>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-pink-400 text-xl font-semibold">Follow Us</h2>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-pink-300 text-xl">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-300 text-xl">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-300 text-xl">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} [Hotel - Grant] | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
