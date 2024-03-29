import React, {useState} from "react";
import {Button,Table,Message,Icon} from "semantic-ui-react"
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign"
import web3 from "../../../../ethereum/web3";

const INITIAL_TRANSACTION_STATE =  {
    loading:"",
    error:"",
    success:"",
};

const RequestIndex = ({
    campaignAddress,requests,requestCount,approversCount,
}) => {
    const router = useRouter();
    const [transactionState,setTransactionState] = useState(INITIAL_TRANSACTION_STATE)
    const {Header,Row,Body,Cell,HeaderCell} = Table;
    const {loading,error,success} = transactionState
    console.log("PROPSLAR:",campaignAddress,requests,requestCount,approversCount)

    const onApprove = async(id) => {
        const campaign = Campaign(campaignAddress)
        setTransactionState({...INITIAL_TRANSACTION_STATE,loading:"Approval is processing....",});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(parseInt(id))
            .send({from:accounts[0],
            })
            .then((res) => {
                console.log("RES:",res)
                const etherscanLink = `https://sepolia.etherscan.io/tx/${res.transactionHash}`;
                setTransactionState({
                    ...INITIAL_TRANSACTION_STATE,
                    success: (
                        <a href={etherscanLink} target="_blank">View the transaction on Etherscan</a>
                    ),
                });
                router.replace(`/campaigns/${campaignAddress}/requests`)
            }).catch((err) => {
                console.log(err)
                setTransactionState({...INITIAL_TRANSACTION_STATE,error:err.message,})
            })
        } catch (error) {
            console.log("error",error)
            setTransactionState({...INITIAL_TRANSACTION_STATE,error:error.message,
            })
        }
    };

    const onFinalise=async(id) => {
        const campaign= Campaign(campaignAddress);
        setTransactionState({...INITIAL_TRANSACTION_STATE,loading:"Finalise request is processing..."})
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(parseInt(id))
            .send({
                from:accounts[0],
            })
            .then((res) => {
                console.log("RES",res)
                const etherscanLink = `https://sepolia.etherscan.io/tx/${res.transactionHash}`;
                setTransactionState({
                    ...INITIAL_TRANSACTION_STATE,
                    success:(
                        <a href={etherscanLink} target="_blank">View the transaction on etherscan</a>
                    ),
                });
                router.replace(`/campaigns/${campaignAddress}/requests`) //will refresh campaign stats
                .catch((err) => {
                    console.log("ERR 1",err)
                    setTransactionState({
                        ...INITIAL_TRANSACTION_STATE,
                        error:err.message,
                    });
                });
            })
            
        } catch (error) {
            console.log("error:",error)
            setTransactionState({
                ...INITIAL_TRANSACTION_STATE,error:error.message
            });
        }
    };

    const renderMessage = () => {
        return(
            <Message icon negative={Boolean(error)} success={Boolean(success)} style={{overflowWrap:"break-word"}}>
                <Icon name={loading ? "circle notched" : error ? "times circle" : "check circle"} loading={Boolean(loading)}/>
                <Message.Content>
                    {Boolean(success) && (
                        <Message.Header>Request Succesful!</Message.Header>
                    )}
                    {loading ? loading : error ? error :success}
                </Message.Content>
            </Message>
        )
    };

    const renderRow = ({approvalCount,description,recipient,value},index) => {
        return(
            <Row key={index} textAlign="center" disabled={complete}>
                <Cell>{index}</Cell>
                <Cell>{description}</Cell>
                <Cell>{web3.utils.fromWei(value,"ether")}</Cell>
                <Cell>{recipient}</Cell>
                <Cell>{approvalCount} / {approversCount}</Cell>
                <Cell>
                    {complete ? (
                        "Finalised"
                    ) : approvalCount >= approversCount/2 ? (
                        "Quota met"
                    ) : (
                        <Button color="green" basic size="large" disabled={Boolean(loading)} onClick={() => onApprove(index)}>Approve</Button>
                    )} 
                </Cell>
                <Cell>
                    {complete? (
                        "Finalised"
                    ) : (
                        <Button color="pink" basic size="large" disabled={Boolean(loading)} onClick={() => onFinalise(index)}>Finalise</Button>
                    )}
                </Cell>
            </Row>
        )
    }
    return(
        <Layout>
            <h1>Requests</h1>
            <Button onClick={() => router.push(`/campaigns/${campaignAddress}/requests/new`)}
            color="teal" size="large" floated="right" style={{marginBottom:"20 px"}}
            >Add Request</Button>
            <Table>
                <Header>
                    <Row textAlign="center">
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Amount (eth)</HeaderCell>
                    <HeaderCell>Recipient</HeaderCell>
                    <HeaderCell>Approval Count</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalise</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {requests ? (
                        requests.map((request,index) => {
                            return renderRow(request,index)
                        }) 
                    ) : (
                        <Row>Something went wrong!</Row>
                    )}
                </Body>
            </Table>
            {Boolean(loading || error || success) && renderMessage()}
        </Layout>
    )
}

RequestIndex.getInitialProps = async(props) => {
    const {campaignAddress}  =props.query;
    const campaign = Campaign(campaignAddress)
    const requestCount = await campaign.methods.getRequestsCount().call();
    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element,index) => {
            return campaign.methods.requests(index).call();
        })
    );
    const approversCount = await campaign.methods.approversCount().call();
    return {campaignAddress,requests, requestCount, approversCount}
}

export default RequestIndex;