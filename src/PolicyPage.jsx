
import "./index.css";

const pages = {
  "/about": {
    label: "THE BRAND",
    title: "ABOUT FASHONE",
    intro: "Modern essentials. Everyday confidence.",
    sections: [
      {
        title: "Our Story",
        text: "FASHONE is built around a simple idea: everyday clothing should feel effortless, look refined, and reflect your personal style."
      },
      {
        title: "Our Philosophy",
        text: "We believe in timeless essentials, thoughtful details, and versatile pieces that go beyond passing trends. Less noise. More meaning."
      },
      {
        title: "Our Promise",
        text: "Our aim is to make discovering everyday style simple, comfortable, and enjoyable."
      }
    ]
  },
  "/shipping-policy": {
    label: "DELIVERY INFORMATION",
    title: "SHIPPING POLICY",
    intro: "Everything you need to know about receiving your order.",
    sections: [
      {
        title: "Order Processing",
        text: "Orders are subject to confirmation and processing before dispatch. Your order confirmation is the reference for your purchase."
      },
      {
        title: "Shipping Charges",
        text: "Any applicable shipping charge will be displayed during checkout. Please review your order total before placing an order."
      },
      {
        title: "Delivery Updates",
        text: "Use the Track Order page on our website to check your order status. Delivery timelines will be communicated once the store's shipping arrangements are confirmed."
      },
      {
        title: "Need Help?",
        text: "If you have a question about an order, keep your order number handy when contacting customer support."
      }
    ]
  },
  "/return-policy": {
    label: "CUSTOMER CARE",
    title: "RETURNS & REFUNDS",
    intro: "Your experience matters to us.",
    sections: [
      {
        title: "Return Eligibility",
        text: "Our return window and eligibility conditions must be confirmed before purchases are accepted under a formal return policy. Please contact customer support before sending any item back."
      },
      {
        title: "Damaged or Incorrect Items",
        text: "If an item arrives damaged or differs from what you ordered, contact customer support with your order number and details of the issue."
      },
      {
        title: "Refunds",
        text: "Refund eligibility, processing method, and timing depend on the confirmed return policy and the circumstances of the order."
      },
      {
        title: "Before Returning an Item",
        text: "Please wait for return instructions from customer support. Do not send items to an address that has not been provided by the store."
      }
    ]
  },
  "/contact": {
    label: "WE ARE HERE TO HELP",
    title: "CONTACT US",
    intro: "Questions about your order or the FASHONE collection?",
    sections: [
      {
        title: "Order Enquiries",
        text: "For an existing order, visit Track Order and keep your order number available."
      },
      {
        title: "Product Enquiries",
        text: "For questions about product details, sizes, or availability, contact the store using its verified customer support email."
      },
      {
        title: "Customer Support",
        text: "The official support email and contact hours will be published here once they are confirmed."
      }
    ]
  }
};

export default function PolicyPage({ path }) {
  const page = pages[path] || pages["/about"];

  return (
    <div className="site-shell policy-site">
      <header className="policy-header">
        
      <a className="wordmark policy-header-logo" href="/#home" aria-label="FASHONE Home">
        <img
          src="/images/fashone-logo-transparent.png"
          alt="FASHONE"
          className="wordmark-image"
        />
      </a>


        <nav className="policy-nav" aria-label="Main navigation">
          <a href="/">HOME</a>
          <a href="/#collection">SHOP MEN</a>
          <a href="/about">ABOUT</a>
          <a href="/track-order">TRACK ORDER</a>
        </nav>
      </header>

      <main className="policy-main">
        <p className="eyebrow">{page.label} / FASHONE</p>
        <h1>
          {path === "/about" ? (
            <>ABOUT <span>FASHONE</span></>
          ) : path === "/shipping-policy" ? (
            <>SHIPPING <span>POLICY</span></>
          ) : path === "/return-policy" ? (
            <>RETURNS <span>&amp; REFUNDS</span></>
          ) : path === "/contact" ? (
            <>CONTACT <span>US</span></>
          ) : (
            page.title
          )}
        </h1>
        <p className="policy-intro">{page.intro}</p>

        <div className="policy-rule" />

        {page.sections.map((section, index) => (
          <section className="policy-section" key={section.title}>
            <span className="policy-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}

        <a className="policy-back-link" href="/#collection">
          ← BACK TO THE COLLECTION
        </a>
      </main>

      <footer className="footer policy-footer">
        <a className="wordmark footer-logo" href="/">
          FASHONE<span>.</span>
        </a>

        <p>MODERN ESSENTIALS. EVERYDAY CONFIDENCE.</p>

        <nav className="footer-links" aria-label="Customer information">
          <a href="/about">ABOUT</a>
          <a href="/contact">CONTACT</a>
          <a href="/shipping-policy">SHIPPING</a>
          <a href="/return-policy">RETURNS & REFUNDS</a>
          <a href="/track-order">TRACK ORDER</a>
        </nav>

        <p className="footer-small">
          © {new Date().getFullYear()} FASHONE. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
