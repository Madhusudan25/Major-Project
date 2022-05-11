// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract MajorProject {
        struct PatientHealthData{
        string recordId;
        string recordHash;
    }
    PatientHealthData[] DiabetesRecords;
    PatientHealthData[] HeartRecords;

    address patientPublicAddress;

    mapping(address => PatientHealthData[]) public DiabetesData;
    mapping(address => PatientHealthData[]) public HeartData;

    function setPatientDiabetesData(
        address publicAddress,
        string memory _recordId,
        string memory _recordHash
    ) public {
        patientPublicAddress = publicAddress;
        if (DiabetesData[publicAddress].length == 0) {
            delete DiabetesRecords;
        }
        DiabetesRecords.push(PatientHealthData(_recordId, _recordHash));
        DiabetesData[publicAddress] = DiabetesRecords;
    }

    function getDiabetesData(address pa)
        public
        view
        returns (PatientHealthData[] memory)
    {
        return DiabetesData[pa];
    }

    function setPatientHeartData(
        address publicAddress,
        string memory _recordId,
        string memory _recordHash
    ) public {
        patientPublicAddress = publicAddress;
        if (HeartData[publicAddress].length == 0) {
            delete HeartRecords;
        }
        HeartRecords.push(PatientHealthData(_recordId, _recordHash));
        HeartData[publicAddress] = HeartRecords;
    }

    function getHeartData(address pa)
        public
        view
        returns (PatientHealthData[] memory)
    {
        return HeartData[pa];
    }
    
}
