import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react";
import { SignedPayload721WithQuantitySignature } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const signatureDropAddress = "0x0Ae3359B31697f352118cf7CE1C7bea0E4e285F0";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: signatureDrop } = useContract(
    signatureDropAddress,
    "signature-drop"
  );

  async function claim() {
    try {
      const tx = await signatureDrop?.claim(1);
      alert(`Succesfully minted NFT!`);
    } catch (error: any) {
      alert(error?.message);
    }
  }

  async function claimWithSignature() {
    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });

    console.log(signedPayloadReq);

    if (signedPayloadReq.status === 400) {
      alert(
        "Looks like you don't own an early access NFT :( You don't qualify for the free mint."
      );
      return;
    } else {
      try {
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        alert(`Succesfully minted NFT!`);
      } catch (error: any) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Signature Drop</h1>

      <p className={styles.describe}>
        In this example, users who own one of our{" "}
        <a href="https://opensea.io/collection/baddiesofficial">
          Baddies NFTs
        </a>{" "}
        can mint for free using the{" "}
        <a href="https://portal.thirdweb.com/pre-built-contracts/signature-drop#signature-minting">
          Signature Mint
        </a>
        . However, for those who don&apos;t own a Baddie NFT, they can
        still claim using the regular claim function.
      </p>

      <div className={styles.nftBoxGrid}>
        <div className={styles.optionSelectBox}>
          <img src={`/icons/drop.webp`} alt="drop" className={styles.cardImg} />
          <h2 className={styles.selectBoxTitle}>Claim NFT</h2>
          <p className={styles.selectBoxDescription}>
            Use the normal <code>claim</code> function to mint an NFT under the
            conditions of the claim phase.
          </p>

          <Web3Button
            contractAddress={signatureDropAddress}
            action={() => claim()}
            colorMode="dark"
          >
            Claim
          </Web3Button>
        </div>

        <div className={styles.optionSelectBox}>
          <img
            src={`/icons/analytics.png`}
            alt="signature-mint"
            className={styles.cardImg}
          />
          <h2 className={styles.selectBoxTitle}>Mint with Signature</h2>
          <p className={styles.selectBoxDescription}>
            Check if you are eligible to mint an NFT for free, by using
            signature-based minting.
          </p>

          <Web3Button
            contractAddress={signatureDropAddress}
            action={() => claimWithSignature()}
            colorMode="dark"
          >
            Claim With Signature
          </Web3Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
