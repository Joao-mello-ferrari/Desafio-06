import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';
import fileSize from 'filesize';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if(!uploadedFiles){
      throw new Error('Arraste um arquivo antes de enviar')
    }
    
    try {
      const data = new FormData();
  
      const fileToUpload = uploadedFiles[0]
  
      data.append('file', fileToUpload.file, fileToUpload.name)
      await api.post('/transactions/import', data);

      history.push('/')
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const filesToUpload = files.map((file)=>{
      return {
        file,
        name: file.name,
        readableSize: fileSize(file.size) 
      }
    })

    setUploadedFiles([...uploadedFiles, ...filesToUpload])
  }
  

  return (
    <>
      <Header size="small" page="import"/>
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
