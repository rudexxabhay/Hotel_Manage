import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Contact <span className="text-pink-600">Us</span>
      </h1>

      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6 md:p-10 grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Get in Touch</h2>
          <p className="text-gray-500">
            Have any questions? Feel free to contact us by filling the form below.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-pink-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-pink-300"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-pink-300"
            ></textarea>
            <button className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Contact Info</h2>
          <p className="text-gray-500">
            Feel free to reach out to us via phone, email, or visit our hotel.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-pink-600 text-xl" />
              <span className="text-gray-600">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-pink-600 text-xl" />
              <span className="text-gray-600">contact@hotelbest.com</span>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-pink-600 text-xl" />
              <span className="text-gray-600">123, Beach Road, Goa, India</span>
            </div>
          </div>

          {/* Google Map Embed */}
          <iframe
            title="hotel-location"
            className="w-full h-48 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31234.7890123456!2d73.7654321!3d15.4876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1234567890abcdef%3A0xabcdef1234567890!2sBest%20Hotel!5e0!3m2!1sen!2sin!4v1635123456789!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
