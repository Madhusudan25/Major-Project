// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract MajorProject {
        struct PatientHealthData{
        string recordId;
        string recordHash;
    }
    PatientHealthData[] Records;
    address patientPublicAddress;

    mapping(address=>PatientHealthData[]) public Data;

    function setPatientData(address publicAddress,string memory _recordId,string memory _recordHash) public {
        // Assigning public address here
      
        patientPublicAddress=publicAddress;

        //Deletinng the global data when new user is registered
        if(Data[publicAddress].length==0){
            delete Records;
        }
        Records.push(PatientHealthData(_recordId,_recordHash));
        Data[publicAddress]=Records;
    }

   
    function getRecordData(address pa) view public returns (PatientHealthData[] memory) {
        return Data[pa];
    }
    
}
