import React from 'react';
import { getProfileMessages, moneyToNumber } from '../utils';
import './FinalProfile.css';

const FinalProfile = ({ profile, simulationData, onRetry, onContinue }) => {
  const messages = getProfileMessages(profile);

  const handleContinue = () => {
    // Llamar al callback onContinue que mostrará el Simulator
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="container formulario">
      <p>
        <button
          type="button"
          className="sc-ezWOiH kmCGjQ LPF_Intentalo_de_nuevo"
          onClick={onRetry}
        >
          Perfilarme de nuevo
        </button>
      </p>
      
      <div className="question-wrapper">
        <div className="jss145">
          <div className="row row-final-profile-title">
            <div className="img-area final-profile-image">
              <img
                src="https://www.principal.com.mx/sites/default/files/2023-06/Group.png"
                alt="Final Profile Image"
                width="53"
                height="74"
              />
            </div>
            <div className="jss146">
              <span>Tu perfil es&nbsp;</span>
              <br />
              <b className="final_profile">
                <span>
                  <strong>{profile}</strong>
                </span>
              </b>
            </div>
          </div>
          
          <div className="row">
            <div className="jss148">
              <p id="final_message">{messages.intro}</p>
            </div>
          </div>
          
          <div className="jss150 row">
            <div className="jss149">
              <p id="final_description">{messages.description}</p>
            </div>
          </div>
        </div>

        <div className="text-default">
          <p>
            Si estás de acuerdo con tu perfil da clic en continuar o si lo
            deseas puedes volver a repetir las preguntas.
          </p>
        </div>

        <div className="sc-cZwWEu kvlxRA">
          <button
            type="button"
            className="sc-ezWOiH cBpLdP LPF_Avanzar_a_simulador"
            onClick={handleContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalProfile;


