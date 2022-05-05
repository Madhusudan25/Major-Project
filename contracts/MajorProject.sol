// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract MajorProject {

    struct mongoData{
        string hashs;
       string mongoid;
    }
    mongoData[] data;
    address publicAddress;
    address[] allPatientAddress;

    mapping(address=>mongoData[]) public Data;

    function setPublicAddress(address pa) public {
        if(has(pa)){
            return;
        }
        allPatientAddress.push(pa);
        publicAddress=pa;
        
    }

    function addNewData(address pa,string memory h,string memory m) public {
        if(!has(pa)){
            return;
        }
        if(Data[pa].length==0){
            delete data;
        }
        data.push(mongoData(h,m));
        Data[pa]=data;
    }
    function getData(address pa) view public returns (mongoData[] memory) {
        return Data[pa];
    }

    function has(address pa) view public returns(bool){
        for (uint256 index = 0; index < allPatientAddress.length; index++) {
            if(allPatientAddress[index]==pa){
                return false;
            }
        }
        return true;
    }
    
}
