import { FunctionalComponent, h } from "preact";
import { FJORDSOL, RYGERBUEN } from "../../consts/PhoneNumbers";

const InfoPanel: FunctionalComponent<{onClose:() => void}> = ({onClose}) => {
  return (
    <div className="fixed  z-20 inset-0 bg-black bg-opacity-90 text-white p-20">
      <article className="relative">
        <button
          className="absolute right-0 rounded-full border-2 border-white flex text-white w-8 h-8 hover:bg-white hover:text-black items-center justify-center"
          aria-label="lukk"
          onClick={onClose}
        >
          X
        </button>

        <h1 className="text-2xl font-bold mb-4">Vassøy ferje rute</h1>
        <p>Utviklet for enkelt å se ferjeplanen</p>
        <p>
          Telefon til <a href={`tel:${FJORDSOL}`}>Fjordsol: 482 01 919</a>
        </p>
        <p>
          Telefon til <a href={`tel:${RYGERBUEN}`}>Rygerbuen: 982 41 520</a>
        </p>
        <p>Jeg tar forbehold om trykkfeil og ved specielle dager, der vil den automatiske datovalg ikke være korrekt.</p>
        <p>
          Hvis der er noen feil eller spørsmål, send en mail til{' '}
          <a href="mailto:dommy.ka@gmail.com">Tommy Andersen</a>
        </p>
        {/*<button id="reload" class="button--reload">Last på nytt</button>*/}
      </article>
    </div>
  );
};

export default InfoPanel;
