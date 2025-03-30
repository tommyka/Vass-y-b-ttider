import { FunctionalComponent, h } from "preact";
import { HURTIGBAAT, RYGERBUEN } from "../../consts/PhoneNumbers";

const InfoPanel: FunctionalComponent<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed z-20 inset-0 bg-black/90 text-white p-16">
      <article className="relative">
        <button
          className="absolute right-0 -mr-8 rounded-full border-2 border-white flex text-white w-8 h-8 hover:bg-white hover:text-black items-center justify-center"
          aria-label="lukk"
          onClick={onClose}
        >
          X
        </button>

        <h1 className="text-2xl font-bold mb-4">Vassøy ferje rute</h1>
        <p>Utviklet for enkelt å se ferjeplanen</p>
        <p>
          Telefon til båtene
          <br />
          <a href={`tel:${HURTIGBAAT}`}>Hurtigbåten: {formatPhoneNumber(HURTIGBAAT)}</a>
          <br />
          <a href={`tel:99466100`}>Reserve båt Helgø Glimt: {formatPhoneNumber("99466100")}</a>
          <br />
          <a href={`tel:${RYGERBUEN}`}>Rygerbuen: {formatPhoneNumber(RYGERBUEN)}</a>
        </p>
        <p>Jeg tar forbehold om trykkfeil og ved specielle dager, der vil den automatiske datovalg ikke være korrekt.</p>
        <p>
          Hvis der er noen feil eller spørsmål, send en mail til <a href="mailto:dommy.ka@gmail.com">Tommy Andersen</a>
        </p>
      </article>
    </div>
  );
};

const formatPhoneNumber = (number: string) => {
  return `${number.substring(0, 3)} ${number.substring(3, 5)} ${number.substring(5, 8)}`;
};

export default InfoPanel;
