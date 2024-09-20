package contract;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/hyperledger/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.6.1.
 */
@SuppressWarnings("rawtypes")
public class TurtleDocumentation extends Contract {
    public static final String BINARY = "Bin file was not provided";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_RENOUNCEOWNERSHIP = "renounceOwnership";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final String FUNC_REGISTERTURTLE = "registerTurtle";

    public static final String FUNC_REGISTERTURTLEMULTIPLICATIONDOCUMENT = "registerTurtleMultiplicationDocument";

    public static final String FUNC_SEARCHTUTLEMULTIPLICATIONDOCUMENT = "searchTutleMultiplicationDocument";

    public static final String FUNC_REGISTERTURTLEASSIGNEEDOCUMENT = "registerTurtleAssigneeDocument";

    public static final String FUNC_REGISTERTURTLEGRANTORDOCUMENT = "registerTurtleGrantorDocument";

    public static final String FUNC_SEARCHTURTLETRANSFERDOCUMENT = "searchTurtleTransferDocument";

    public static final String FUNC_REGISTERTURTLEDEATHDOCUMENT = "registerTurtleDeathDocument";

    public static final String FUNC_SEARCHTURTLEDEATHDOCUMENT = "searchTurtleDeathDocument";

    public static final String FUNC_CHANGETURTLEOWNER = "changeTurtleOwner";

    public static final String FUNC_APPROVEMULTIPLICATIONDOCBYREVIEWER = "approveMultiplicationDocByReviewer";

    public static final String FUNC_APPROVETRANSFERDOCBYREVIEWER = "approveTransferDocByReviewer";

    public static final String FUNC_SEARCHCURRENTDOCUMENTHASH = "searchCurrentDocumentHash";

    public static final Event CURRENTTURTLEDOCUMENT_EVENT = new Event("CurrentTurtleDocument", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Bytes32>(true) {}));
    ;

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    public static final Event TURTLEDEATH_EVENT = new Event("TurtleDeath", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>(true) {}, new TypeReference<Bytes32>(true) {}));
    ;

    public static final Event TURTLEMULTIPLICATION_EVENT = new Event("TurtleMultiplication", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>(true) {}, new TypeReference<Bytes32>(true) {}));
    ;

    public static final Event TURTLEOWNERCHANGED_EVENT = new Event("TurtleOwnerChanged", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>(true) {}));
    ;

    public static final Event TURTLEREGISTERED_EVENT = new Event("TurtleRegistered", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>(true) {}));
    ;

    public static final Event TURTLETRANSFERRED_EVENT = new Event("TurtleTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>(true) {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Bytes32>(true) {}));
    ;

    @Deprecated
    protected TurtleDocumentation(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected TurtleDocumentation(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected TurtleDocumentation(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected TurtleDocumentation(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<CurrentTurtleDocumentEventResponse> getCurrentTurtleDocumentEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(CURRENTTURTLEDOCUMENT_EVENT, transactionReceipt);
        ArrayList<CurrentTurtleDocumentEventResponse> responses = new ArrayList<CurrentTurtleDocumentEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            CurrentTurtleDocumentEventResponse typedResponse = new CurrentTurtleDocumentEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static CurrentTurtleDocumentEventResponse getCurrentTurtleDocumentEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(CURRENTTURTLEDOCUMENT_EVENT, log);
        CurrentTurtleDocumentEventResponse typedResponse = new CurrentTurtleDocumentEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<CurrentTurtleDocumentEventResponse> currentTurtleDocumentEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getCurrentTurtleDocumentEventFromLog(log));
    }

    public Flowable<CurrentTurtleDocumentEventResponse> currentTurtleDocumentEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CURRENTTURTLEDOCUMENT_EVENT));
        return currentTurtleDocumentEventFlowable(filter);
    }

    public static List<OwnershipTransferredEventResponse> getOwnershipTransferredEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, transactionReceipt);
        ArrayList<OwnershipTransferredEventResponse> responses = new ArrayList<OwnershipTransferredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static OwnershipTransferredEventResponse getOwnershipTransferredEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, log);
        OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
        typedResponse.log = log;
        typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getOwnershipTransferredEventFromLog(log));
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(OWNERSHIPTRANSFERRED_EVENT));
        return ownershipTransferredEventFlowable(filter);
    }

    public static List<TurtleDeathEventResponse> getTurtleDeathEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(TURTLEDEATH_EVENT, transactionReceipt);
        ArrayList<TurtleDeathEventResponse> responses = new ArrayList<TurtleDeathEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TurtleDeathEventResponse typedResponse = new TurtleDeathEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static TurtleDeathEventResponse getTurtleDeathEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(TURTLEDEATH_EVENT, log);
        TurtleDeathEventResponse typedResponse = new TurtleDeathEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<TurtleDeathEventResponse> turtleDeathEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getTurtleDeathEventFromLog(log));
    }

    public Flowable<TurtleDeathEventResponse> turtleDeathEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TURTLEDEATH_EVENT));
        return turtleDeathEventFlowable(filter);
    }

    public static List<TurtleMultiplicationEventResponse> getTurtleMultiplicationEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(TURTLEMULTIPLICATION_EVENT, transactionReceipt);
        ArrayList<TurtleMultiplicationEventResponse> responses = new ArrayList<TurtleMultiplicationEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TurtleMultiplicationEventResponse typedResponse = new TurtleMultiplicationEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static TurtleMultiplicationEventResponse getTurtleMultiplicationEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(TURTLEMULTIPLICATION_EVENT, log);
        TurtleMultiplicationEventResponse typedResponse = new TurtleMultiplicationEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<TurtleMultiplicationEventResponse> turtleMultiplicationEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getTurtleMultiplicationEventFromLog(log));
    }

    public Flowable<TurtleMultiplicationEventResponse> turtleMultiplicationEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TURTLEMULTIPLICATION_EVENT));
        return turtleMultiplicationEventFlowable(filter);
    }

    public static List<TurtleOwnerChangedEventResponse> getTurtleOwnerChangedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(TURTLEOWNERCHANGED_EVENT, transactionReceipt);
        ArrayList<TurtleOwnerChangedEventResponse> responses = new ArrayList<TurtleOwnerChangedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TurtleOwnerChangedEventResponse typedResponse = new TurtleOwnerChangedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.oldOwner = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.newOwner = (byte[]) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static TurtleOwnerChangedEventResponse getTurtleOwnerChangedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(TURTLEOWNERCHANGED_EVENT, log);
        TurtleOwnerChangedEventResponse typedResponse = new TurtleOwnerChangedEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.oldOwner = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.newOwner = (byte[]) eventValues.getIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<TurtleOwnerChangedEventResponse> turtleOwnerChangedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getTurtleOwnerChangedEventFromLog(log));
    }

    public Flowable<TurtleOwnerChangedEventResponse> turtleOwnerChangedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TURTLEOWNERCHANGED_EVENT));
        return turtleOwnerChangedEventFlowable(filter);
    }

    public static List<TurtleRegisteredEventResponse> getTurtleRegisteredEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(TURTLEREGISTERED_EVENT, transactionReceipt);
        ArrayList<TurtleRegisteredEventResponse> responses = new ArrayList<TurtleRegisteredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TurtleRegisteredEventResponse typedResponse = new TurtleRegisteredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static TurtleRegisteredEventResponse getTurtleRegisteredEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(TURTLEREGISTERED_EVENT, log);
        TurtleRegisteredEventResponse typedResponse = new TurtleRegisteredEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.applicant = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<TurtleRegisteredEventResponse> turtleRegisteredEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getTurtleRegisteredEventFromLog(log));
    }

    public Flowable<TurtleRegisteredEventResponse> turtleRegisteredEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TURTLEREGISTERED_EVENT));
        return turtleRegisteredEventFlowable(filter);
    }

    public static List<TurtleTransferredEventResponse> getTurtleTransferredEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(TURTLETRANSFERRED_EVENT, transactionReceipt);
        ArrayList<TurtleTransferredEventResponse> responses = new ArrayList<TurtleTransferredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            TurtleTransferredEventResponse typedResponse = new TurtleTransferredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.grantApplicant = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.assignApplicant = (String) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static TurtleTransferredEventResponse getTurtleTransferredEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(TURTLETRANSFERRED_EVENT, log);
        TurtleTransferredEventResponse typedResponse = new TurtleTransferredEventResponse();
        typedResponse.log = log;
        typedResponse.turtleId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.documentHash = (byte[]) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.grantApplicant = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.assignApplicant = (String) eventValues.getNonIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<TurtleTransferredEventResponse> turtleTransferredEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getTurtleTransferredEventFromLog(log));
    }

    public Flowable<TurtleTransferredEventResponse> turtleTransferredEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(TURTLETRANSFERRED_EVENT));
        return turtleTransferredEventFlowable(filter);
    }

    public RemoteFunctionCall<String> owner() {
        final Function function = new Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> renounceOwnership() {
        final Function function = new Function(
                FUNC_RENOUNCEOWNERSHIP, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> transferOwnership(String newOwner) {
        final Function function = new Function(
                FUNC_TRANSFEROWNERSHIP, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> registerTurtle(String _turtleId,
            String _applicant) {
        final Function function = new Function(
                FUNC_REGISTERTURTLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_applicant)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> registerTurtleMultiplicationDocument(
            String _turtleId, String _applicant, byte[] _documentHash, BigInteger _count,
            String _area, String _purpose, String _location, String _fatherId, String _motherId,
            String _locationSpecification, String _multiplicationMethod,
            String _shelterSpecification) {
        final Function function = new Function(
                FUNC_REGISTERTURTLEMULTIPLICATIONDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_applicant), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash), 
                new org.web3j.abi.datatypes.generated.Uint8(_count), 
                new org.web3j.abi.datatypes.Utf8String(_area), 
                new org.web3j.abi.datatypes.Utf8String(_purpose), 
                new org.web3j.abi.datatypes.Utf8String(_location), 
                new org.web3j.abi.datatypes.Utf8String(_fatherId), 
                new org.web3j.abi.datatypes.Utf8String(_motherId), 
                new org.web3j.abi.datatypes.Utf8String(_locationSpecification), 
                new org.web3j.abi.datatypes.Utf8String(_multiplicationMethod), 
                new org.web3j.abi.datatypes.Utf8String(_shelterSpecification)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Multiplication> searchTutleMultiplicationDocument(String _turtleId,
            byte[] _documentHash) {
        final Function function = new Function(FUNC_SEARCHTUTLEMULTIPLICATIONDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Multiplication>() {}));
        return executeRemoteCallSingleValueReturn(function, Multiplication.class);
    }

    public RemoteFunctionCall<TransactionReceipt> registerTurtleAssigneeDocument(String _turtleId,
            String _applicant, byte[] _documentHash, String _assigneeId, BigInteger _count,
            String _transferReason, String _purpose) {
        final Function function = new Function(
                FUNC_REGISTERTURTLEASSIGNEEDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_applicant), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash), 
                new org.web3j.abi.datatypes.Utf8String(_assigneeId), 
                new org.web3j.abi.datatypes.generated.Uint8(_count), 
                new org.web3j.abi.datatypes.Utf8String(_transferReason), 
                new org.web3j.abi.datatypes.Utf8String(_purpose)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> registerTurtleGrantorDocument(String _turtleId,
            String _applicant, byte[] _documentHash, String _grantorId, String _aquisition,
            String _fatherId, String _motherId) {
        final Function function = new Function(
                FUNC_REGISTERTURTLEGRANTORDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_applicant), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash), 
                new org.web3j.abi.datatypes.Utf8String(_grantorId), 
                new org.web3j.abi.datatypes.Utf8String(_aquisition), 
                new org.web3j.abi.datatypes.Utf8String(_fatherId), 
                new org.web3j.abi.datatypes.Utf8String(_motherId)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Transfer> searchTurtleTransferDocument(String _turtleId,
            byte[] _documentHash) {
        final Function function = new Function(FUNC_SEARCHTURTLETRANSFERDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Transfer>() {}));
        return executeRemoteCallSingleValueReturn(function, Transfer.class);
    }

    public RemoteFunctionCall<TransactionReceipt> registerTurtleDeathDocument(String _turtleId,
            String _applicant, byte[] _documentHash, String _shelter, BigInteger _count,
            String _deathReason, String _plan, String _deathImage, String _diagnosis) {
        final Function function = new Function(
                FUNC_REGISTERTURTLEDEATHDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_applicant), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash), 
                new org.web3j.abi.datatypes.Utf8String(_shelter), 
                new org.web3j.abi.datatypes.generated.Uint8(_count), 
                new org.web3j.abi.datatypes.Utf8String(_deathReason), 
                new org.web3j.abi.datatypes.Utf8String(_plan), 
                new org.web3j.abi.datatypes.Utf8String(_deathImage), 
                new org.web3j.abi.datatypes.Utf8String(_diagnosis)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Death> searchTurtleDeathDocument(String _turtleId,
            byte[] _documentHash) {
        final Function function = new Function(FUNC_SEARCHTURTLEDEATHDOCUMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Death>() {}));
        return executeRemoteCallSingleValueReturn(function, Death.class);
    }

    public RemoteFunctionCall<TransactionReceipt> changeTurtleOwner(String _turtleId,
            String _oldOwner, String _newOwner) {
        final Function function = new Function(
                FUNC_CHANGETURTLEOWNER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.Utf8String(_oldOwner), 
                new org.web3j.abi.datatypes.Utf8String(_newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> approveMultiplicationDocByReviewer(
            String _turtleId, byte[] _documentHash) {
        final Function function = new Function(
                FUNC_APPROVEMULTIPLICATIONDOCBYREVIEWER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> approveTransferDocByReviewer(String _turtleId,
            byte[] _documentHash) {
        final Function function = new Function(
                FUNC_APPROVETRANSFERDOCBYREVIEWER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId), 
                new org.web3j.abi.datatypes.generated.Bytes32(_documentHash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<byte[]> searchCurrentDocumentHash(String _turtleId) {
        final Function function = new Function(FUNC_SEARCHCURRENTDOCUMENTHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_turtleId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    @Deprecated
    public static TurtleDocumentation load(String contractAddress, Web3j web3j,
            Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new TurtleDocumentation(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static TurtleDocumentation load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new TurtleDocumentation(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static TurtleDocumentation load(String contractAddress, Web3j web3j,
            Credentials credentials, ContractGasProvider contractGasProvider) {
        return new TurtleDocumentation(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static TurtleDocumentation load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new TurtleDocumentation(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static class Multiplication extends DynamicStruct {
        public String applicant;

        public BigInteger count;

        public String area;

        public String purpose;

        public String location;

        public String fatherId;

        public String motherId;

        public String locationSpecification;

        public String multiplicationMethod;

        public String shelterSpecification;

        public Multiplication(String applicant, BigInteger count, String area, String purpose,
                String location, String fatherId, String motherId, String locationSpecification,
                String multiplicationMethod, String shelterSpecification) {
            super(new org.web3j.abi.datatypes.Utf8String(applicant), 
                    new org.web3j.abi.datatypes.generated.Uint8(count), 
                    new org.web3j.abi.datatypes.Utf8String(area), 
                    new org.web3j.abi.datatypes.Utf8String(purpose), 
                    new org.web3j.abi.datatypes.Utf8String(location), 
                    new org.web3j.abi.datatypes.Utf8String(fatherId), 
                    new org.web3j.abi.datatypes.Utf8String(motherId), 
                    new org.web3j.abi.datatypes.Utf8String(locationSpecification), 
                    new org.web3j.abi.datatypes.Utf8String(multiplicationMethod), 
                    new org.web3j.abi.datatypes.Utf8String(shelterSpecification));
            this.applicant = applicant;
            this.count = count;
            this.area = area;
            this.purpose = purpose;
            this.location = location;
            this.fatherId = fatherId;
            this.motherId = motherId;
            this.locationSpecification = locationSpecification;
            this.multiplicationMethod = multiplicationMethod;
            this.shelterSpecification = shelterSpecification;
        }

        public Multiplication(Utf8String applicant, Uint8 count, Utf8String area,
                Utf8String purpose, Utf8String location, Utf8String fatherId, Utf8String motherId,
                Utf8String locationSpecification, Utf8String multiplicationMethod,
                Utf8String shelterSpecification) {
            super(applicant, count, area, purpose, location, fatherId, motherId, locationSpecification, multiplicationMethod, shelterSpecification);
            this.applicant = applicant.getValue();
            this.count = count.getValue();
            this.area = area.getValue();
            this.purpose = purpose.getValue();
            this.location = location.getValue();
            this.fatherId = fatherId.getValue();
            this.motherId = motherId.getValue();
            this.locationSpecification = locationSpecification.getValue();
            this.multiplicationMethod = multiplicationMethod.getValue();
            this.shelterSpecification = shelterSpecification.getValue();
        }
    }

    public static class Transfer extends DynamicStruct {
        public String grantApplicant;

        public String assignApplicant;

        public String grantorId;

        public String assigneeId;

        public BigInteger count;

        public String transferReason;

        public String purpose;

        public String aquisition;

        public String fatherId;

        public String motherId;

        public Transfer(String grantApplicant, String assignApplicant, String grantorId,
                String assigneeId, BigInteger count, String transferReason, String purpose,
                String aquisition, String fatherId, String motherId) {
            super(new org.web3j.abi.datatypes.Utf8String(grantApplicant), 
                    new org.web3j.abi.datatypes.Utf8String(assignApplicant), 
                    new org.web3j.abi.datatypes.Utf8String(grantorId), 
                    new org.web3j.abi.datatypes.Utf8String(assigneeId), 
                    new org.web3j.abi.datatypes.generated.Uint8(count), 
                    new org.web3j.abi.datatypes.Utf8String(transferReason), 
                    new org.web3j.abi.datatypes.Utf8String(purpose), 
                    new org.web3j.abi.datatypes.Utf8String(aquisition), 
                    new org.web3j.abi.datatypes.Utf8String(fatherId), 
                    new org.web3j.abi.datatypes.Utf8String(motherId));
            this.grantApplicant = grantApplicant;
            this.assignApplicant = assignApplicant;
            this.grantorId = grantorId;
            this.assigneeId = assigneeId;
            this.count = count;
            this.transferReason = transferReason;
            this.purpose = purpose;
            this.aquisition = aquisition;
            this.fatherId = fatherId;
            this.motherId = motherId;
        }

        public Transfer(Utf8String grantApplicant, Utf8String assignApplicant, Utf8String grantorId,
                Utf8String assigneeId, Uint8 count, Utf8String transferReason, Utf8String purpose,
                Utf8String aquisition, Utf8String fatherId, Utf8String motherId) {
            super(grantApplicant, assignApplicant, grantorId, assigneeId, count, transferReason, purpose, aquisition, fatherId, motherId);
            this.grantApplicant = grantApplicant.getValue();
            this.assignApplicant = assignApplicant.getValue();
            this.grantorId = grantorId.getValue();
            this.assigneeId = assigneeId.getValue();
            this.count = count.getValue();
            this.transferReason = transferReason.getValue();
            this.purpose = purpose.getValue();
            this.aquisition = aquisition.getValue();
            this.fatherId = fatherId.getValue();
            this.motherId = motherId.getValue();
        }
    }

    public static class Death extends DynamicStruct {
        public String applicant;

        public String shelter;

        public BigInteger count;

        public String deathReason;

        public String plan;

        public String deathImage;

        public String diagnosis;

        public Death(String applicant, String shelter, BigInteger count, String deathReason,
                String plan, String deathImage, String diagnosis) {
            super(new org.web3j.abi.datatypes.Utf8String(applicant), 
                    new org.web3j.abi.datatypes.Utf8String(shelter), 
                    new org.web3j.abi.datatypes.generated.Uint8(count), 
                    new org.web3j.abi.datatypes.Utf8String(deathReason), 
                    new org.web3j.abi.datatypes.Utf8String(plan), 
                    new org.web3j.abi.datatypes.Utf8String(deathImage), 
                    new org.web3j.abi.datatypes.Utf8String(diagnosis));
            this.applicant = applicant;
            this.shelter = shelter;
            this.count = count;
            this.deathReason = deathReason;
            this.plan = plan;
            this.deathImage = deathImage;
            this.diagnosis = diagnosis;
        }

        public Death(Utf8String applicant, Utf8String shelter, Uint8 count, Utf8String deathReason,
                Utf8String plan, Utf8String deathImage, Utf8String diagnosis) {
            super(applicant, shelter, count, deathReason, plan, deathImage, diagnosis);
            this.applicant = applicant.getValue();
            this.shelter = shelter.getValue();
            this.count = count.getValue();
            this.deathReason = deathReason.getValue();
            this.plan = plan.getValue();
            this.deathImage = deathImage.getValue();
            this.diagnosis = diagnosis.getValue();
        }
    }

    public static class CurrentTurtleDocumentEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] documentHash;
    }

    public static class OwnershipTransferredEventResponse extends BaseEventResponse {
        public String previousOwner;

        public String newOwner;
    }

    public static class TurtleDeathEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] applicant;

        public byte[] documentHash;
    }

    public static class TurtleMultiplicationEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] applicant;

        public byte[] documentHash;
    }

    public static class TurtleOwnerChangedEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] oldOwner;

        public byte[] newOwner;
    }

    public static class TurtleRegisteredEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] applicant;
    }

    public static class TurtleTransferredEventResponse extends BaseEventResponse {
        public byte[] turtleId;

        public byte[] documentHash;

        public String grantApplicant;

        public String assignApplicant;
    }
}
