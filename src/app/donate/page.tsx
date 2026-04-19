import Link from "next/link";
import DonateModalTrigger from "./DonateModalTrigger";
import styles from "./page.module.css";

export default function DonatePage() {

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <p className="subheading reveal">Donate</p>
        <h1 className="heading-display reveal">Make a donation</h1>
        <p className={styles.subtitle}>
          Use mobile money through Flutterwave or card through MarzPay. Donations support school
          retention, safe spaces, mentorship, and legal advocacy for girls in Uganda.
        </p>
        <div className={styles.actions}>
          <DonateModalTrigger />
          <Link href="/events" className={styles.secondaryBtn}>
            <span>See upcoming events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
