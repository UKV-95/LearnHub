import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';
import './CourseContent.css';  // ✅ Create this CSS file for layout & certificate styles

const CourseContent = () => {
  const user = useContext(UserContext);
  const { courseId, courseTitle } = useParams();

  const [courseContent, setCourseContent] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
  const [completedModule, setCompletedModule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const completedModuleIds = completedModule.map((item) => item.sectionId);

  const getCourseContent = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        setCourseContent(res.data.courseContent);
        setCompletedModule(res.data.completeModule || []);
        setCertificate(res.data.certficateData?.updatedAt || new Date());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPdfDocument = (rootElementId) => {
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 10, 10, 280, 190);
      pdf.save('download-certificate.pdf');
    });
  };

  const playVideo = (videoPath, index) => {
    setCurrentVideo(videoPath);
    setPlayingSectionIndex(index);
  };

  const completeModule = async (sectionId) => {
    if (completedModuleIds.includes(sectionId)) return;

    try {
      const res = await axiosInstance.post(`/api/user/completemodule`, {
        courseId,
        sectionId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        alert(res.data.message);
        getCourseContent();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseContent();
  }, [courseId]);

  return (
    <>
      <NavBar />
      <h1 className='my-3 text-center'>Welcome to the course: {courseTitle}</h1>

      <div className='course-content-container'>
        {/* Left Section: Course Accordion */}
        <div className="course-section">
          <Accordion defaultActiveKey="0" flush>
            {courseContent.map((section, index) => {
              const sectionId = section._id;
              const isSectionCompleted = completedModuleIds.includes(sectionId);

              return (
                <Accordion.Item key={sectionId} eventKey={index.toString()}>
                  <Accordion.Header>{section.S_title}</Accordion.Header>
                  <Accordion.Body>
                    <p>{section.S_description}</p>
                    {section.S_content && (
                      <Button
                        color='success'
                        className='mx-2'
                        variant="text"
                        size="small"
                        onClick={() => playVideo(`http://localhost:8000${section.S_content.path}`, index)}
                      >
                        Play Video
                      </Button>
                    )}
                    {!isSectionCompleted && (
                      <Button
                        variant='success'
                        size='small'
                        onClick={() => completeModule(sectionId)}
                        disabled={section.S_content && playingSectionIndex !== index}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}

            {completedModule.length === courseContent.length && (
              <Button className='my-2' onClick={() => setShowModal(true)}>
                Download Certificate
              </Button>
            )}
          </Accordion>
        </div>

        {/* Right Section: Video Player */}
        <div className="course-video">
          {currentVideo && (
            <ReactPlayer
              url={currentVideo}
              width='100%'
              height='100%'
              controls
            />
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Completion Certificate</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div id='certificate-download' className="certificate">
            <div className='certificate-content'>
              <h1>Certificate of Completion</h1>
              <p>This is to certify that</p>
              <h2>{user.userData.name}</h2>
              <p>has successfully completed the course</p>
              <h3>{courseTitle}</h3>
              <p>on</p>
              <p className="date">{new Date(certificate).toLocaleDateString()}</p>
            </div>
          </div>

          <Button
            onClick={() => downloadPdfDocument('certificate-download')}
            style={{ float: 'right', marginTop: 10 }}
          >
            Download Certificate
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CourseContent;