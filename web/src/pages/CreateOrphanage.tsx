import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiX, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

import '../styles/pages/create-orphanage.css';
import api from "../services/api";

export default function CreateOrphanage() {

  const popup = document.querySelector('.full-screen');

  const [position, setPosition] = useState({ latitude: 0, longitude:0 })
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
    
  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image)
    })

    await api.post('orphanages', data);
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return;
    }

    const selectedImages = [...images, ...Array.from(event.target.files)]

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  function togglePopup() {
    if(popup != null) {
      popup.classList.toggle('hidden');
    }
  }

  return (
    <div id="page-create-orphanage">
      <div className="full-screen hidden flex-container-center">
        <FiCheckCircle size={70} />
        <h1>Cadastro realizado com sucesso</h1>
        <Link to="/app" className="backToMap">Retornar ao mapa</Link>
      </div>

      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <div className="map-container">
              <Map 
                center={[-24.0035855,-46.4165201]} 
                style={{ width: '100%', height: 280 }}
                zoom={15}
                onclick={handleMapClick}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                { position.latitude !== 0 &&
                  (
                    <Marker 
                      interactive={false} 
                      icon={mapIcon} 
                      position={[
                        position.latitude, 
                        position.longitude
                      ]} 
                    />
                  )}              

              </Map>

              <footer>
                <p>Clique no mapa para adicionar a localização</p>
              </footer>

            </div>
            
            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300}
                value={about} 
                onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                  {previewImages.map((image, index) => {
                    return(
                      <div key={image} className="image-group">
                        <img src={image} alt={name} />

                        <button 
                          type="button" 
                          className="close-image"
                          onClick={
                            () => {
                              const selectedImage = images;

                              selectedImage.splice(index, 1);

                              setImages(selectedImage);

                              const selectedImagesPreview = images.map(image => {
                                return URL.createObjectURL(image);
                              })
                          
                              setPreviewImages(selectedImagesPreview);
                            }
                          }>
                          <FiX size={22} color="#FF669D" />
                        </button>
                      </div>
                    )
                  })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instructions} 
                onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours" 
                value={opening_hours} 
                onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}>
                    Sim
                  </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}>
                    Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" onClick={togglePopup} type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
