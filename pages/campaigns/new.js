import React, {useState,useEffect} from "react";
import {Button,Form,Input,Message,Icon} from "semantic-ui-react"
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory"
import web3 from "../../ethereum/web3";
import {Link,Router} from '../../routes'


const INITIAL_TRANSACTION_STATE = {
    loading:"",
    error:"",
    success:"",
}

const CampaignNew = (props) => {
    const router = useRouter()
    const [minimumContribution,setMinimumContribution] = useState("")
    const [transactionState,setTransactionState] = useState(INITIAL_TRANSACTION_STATE)
    const {loading,error,success} = transactionState; 

    const onSubmit = async(event) => {
        event.preventDefault();

        setTransactionState({
            ...INITIAL_TRANSACTION_STATE,
            loading:"Transaction is still processing...",
        });

        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        await factory.methods.createCampaign(minimumContribution)
        .send({
            from:accounts[0],
        }).then((res) => {
            console.log("RETURNING VALUE OF RES",res)
            const etherscanLink = `https://sepolia.etherscan.io/tx/${res.transactionHash}`;
            setTransactionState({
                ...INITIAL_TRANSACTION_STATE,
                success:(
                    <a href={etherscanLink} target="_blank">View the transaction on ETH Scan</a>
                ),
            });
            router.push("/");
        }).catch((err) => {
            console.log(err)
            setTransactionState({
                ...INITIAL_TRANSACTION_STATE,
                error:err.message
            });
        });
        setMinimumContribution("");
    }

    const renderMessage = () => {
        return(
            <Message icon negative={Boolean(error)} success={Boolean(success)}>
                <Icon
                    name={
                        loading ? "circle notched" : error ? "times circle" : "check circle"
                    }
                    loading={Boolean(loading)}
                />
                <Message.Content>
                    {Boolean(success) && (
                        <Message.Header>Transaction Success!</Message.Header>
                    )}
                    {loading ? loading : error ? error : success}
                </Message.Content>
            </Message>
        )
    }


    return(
        <Layout>
            <h1>Create a Campaign</h1>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                    label="wei"
                    labelPosition="right"
                    focus
                    type="number"
                    min="0"
                    disabled = {Boolean(loading)} //disable input if loading!
                    value={minimumContribution}
                    onChange={(e) => setMinimumContribution(e.target.value)}
                    />
                </Form.Field>
                <Button color="teal" disabled={Boolean(loading)}>
                    Create!
                </Button>
            </Form>
            {Boolean(loading || error || success) && renderMessage()}
        </Layout>
    )

}


export default CampaignNew