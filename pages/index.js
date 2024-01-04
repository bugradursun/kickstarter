import React,{useState,useEffect} from "react";
import factory from '../ethereum/factory'
import "semantic-ui-css/semantic.min.css"
import {Card, Button , Icon} from "semantic-ui-react"
import {useRouter} from "next/router"
import Link from "next/link"
import Layout from "../components/Layout";

function CampaignIndex({campaigns}) {
    const router = useRouter();
    console.log("campaigns",campaigns)

    const items = campaigns.map((campaignAddress) => {
        console.log(campaignAddress);
        return {
          header: campaignAddress,
          description: (
            <Link href={`/campaigns/${campaignAddress}`} legacyBehavior>
              <a>View campaign</a>
            </Link>
          ),
          fluid: true,
        };
      });

    return(
        <>
        <Layout>
        <h1>Open Campaigns</h1>
        <Button
            icon
            primary
            floated="right"
            color="teal"
            size="large"
            onClick={() => router.push("/campaigns/new")}
            style={{marginBottom:"20px"}}
        >
            <Icon name="add circle"/>
            {"  "}Create New Campaign
        </Button>
        <Card.Group items={items} centered />
        </Layout>
        </>
    )
    
}
//server side rendering to call the campaign contracts(so good for slow devices)

    CampaignIndex.getInitialProps = async () => {
        const campaigns = await factory.methods.getDeployedCampaigns().call()
        return {campaigns}
} //result of the getInitialProps will be forwarded to the React component as props!!!

export default CampaignIndex